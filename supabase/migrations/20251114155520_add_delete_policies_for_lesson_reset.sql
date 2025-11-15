-- Add DELETE policies for lesson reset functionality

-- Allow users to delete their own lesson progress
DROP POLICY IF EXISTS "Users can delete their own lesson progress" ON user_lesson_progress;
CREATE POLICY "Users can delete their own lesson progress"
ON user_lesson_progress
FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- Allow users to delete their own quiz attempts
DROP POLICY IF EXISTS "Users can delete their own quiz attempts" ON user_lesson_quiz_attempts;
CREATE POLICY "Users can delete their own quiz attempts"
ON user_lesson_quiz_attempts
FOR DELETE TO authenticated
USING (auth.uid() = user_id);
