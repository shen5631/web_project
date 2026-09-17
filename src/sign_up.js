async function handleSignUp(stuId, stuName, role = 'user') {
  try {
    const { data: existingUser, error: checkError } = await window.supabaseClient
      .from('users')
      .select('stu_id')
      .eq('stu_id', stuId)
      .maybeSingle();

    if (checkError) {
      console.error(checkError);
      alert('DB 확인 중 오류가 발생했습니다.');
      return false;
    }

    if (existingUser) {
      alert('이미 가입된 학번/아이디입니다.');
      return false;
    }

    const { error: insertError } = await window.supabaseClient
      .from('users')
      .insert([
        {
          stu_id: stuId,
          stu_name: stuName,
          role: role,
          banned: false
        }
      ]);

    if (insertError) {
      console.error(insertError);
      alert('회원가입 실패: ' + insertError.message);
      return false;
    }

    alert('회원가입이 완료되었습니다!');
    return true;

  } catch (err) {
    console.error(err);
    alert('처리 중 에러가 발생했습니다.');
    return false;
  }
}