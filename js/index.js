const name = localStorage.getItem("user_name");
document.getElementById("name").innerText = name + " 학생";

console.log("!");

function test() {
  const check = localStorage.getItem("user_auth");
  if (check === "false") {
    alert("게시물 생성 권한이 없습니다.");
    console.log("!");
  } else {
    location.href = "add_dong.html";
  }
}
