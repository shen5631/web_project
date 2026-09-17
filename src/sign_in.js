async function handleSignIn(stuId) {
  try {
    const { data: user, error } = await window.supabaseClient
      .from('users')
      .select('*')
      .eq('stu_id', stuId)
      .maybeSingle();

    if (error) {
      console.error(error);
      alert('로그인 처리 중 오류가 발생했습니다.');
      return false;
    }

    if (!user) {
      alert('존재하지 않는 학번/아이디입니다.');
      return false;
    }

    if (user.banned) {
      alert('⛔ 활동이 정지된 계정입니다. 관리자에게 문의하세요.');
      return false;
    }

    localStorage.setItem('currentUser', JSON.stringify(user));
    alert(`${user.stu_name}님, 환영합니다!`);

    window.location.href = './index.html';
    return true;

  } catch (err) {
    console.error(err);
    alert('로그인 중 에러가 발생했습니다.');
    return false;
  }
}

function getCurrentUser() {
  const userJson = localStorage.getItem('currentUser');
  return userJson ? JSON.parse(userJson) : null;
}

function handleSignOut() {
  localStorage.removeItem('currentUser');
  alert('로그아웃 되었습니다.');
  window.location.href = './login.html';
}