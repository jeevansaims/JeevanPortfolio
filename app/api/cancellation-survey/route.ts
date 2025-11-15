import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Get the authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Validate required fields
    if (
      !body.mainReason ||
      body.satisfaction === undefined ||
      !body.convinceToStay
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Insert survey response
    const { data, error } = await supabase
      .from('cancellation_surveys')
      .insert({
        user_id: user.id,
        email: user.email || '',
        main_reason: body.mainReason,
        main_reason_other: body.mainReasonOther,
        missing_features: body.missingFeatures || [],
        missing_features_other: body.missingFeaturesOther,
        satisfaction: body.satisfaction,
        convince_to_stay: body.convinceToStay,
        likely_to_return: body.likelyToReturn || 5,
        bugs: body.bugs,
        new_feature: body.newFeature,
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving cancellation survey:', error);
      return NextResponse.json(
        { error: 'Failed to save survey' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Cancellation survey error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
