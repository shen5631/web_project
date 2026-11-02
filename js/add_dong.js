// =====================================================
// add_dong.js : 동아리 등록 (지금 board 테이블)
// 저장되는 칸 : user_id, name, img, text, category, link
// 정원, 한 줄 소개, 활동 사진, 영상은 DB 칸이 생기면 저장
// =====================================================

let thumbnailData = null; // 대표 사진 (작게 줄인 이미지 글자)

// 사진을 가로 1200px 이하 JPG로 줄여서 글자(data URL)로 바꾸기
// → Storage 없이도 img 칸에 저장 가능
function resizeImage(file, maxWidth = 1200) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const scale = Math.min(1, maxWidth / image.width);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      image.onerror = reject;
      image.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function board_insert(board) {
  const { data, error } = await DB.from("board").insert([board]).select().single();
  if (error) {
    console.log("에러", error);
    return null;
  }
  return data;
}

async function create(e) {
  e.preventDefault();

  const user = getLoginUser();
  if (!user || !user.auth) {
    alert("게시물 생성 권한이 없습니다.");
    return;
  }

  const form = e.target;
  const button = form.querySelector('button[type="submit"]');
  clearErrors(form);

  const name = document.getElementById("dong_name").value.trim();
  const text = document.getElementById("text").value.trim();
  const selected = document.querySelector("#ctg .켜짐");
  const firstLink = document.querySelector("#link_line .입력칸");

  if (!name) {
    showError("dong_name", "동아리 이름을 입력해 주세요.");
    return;
  }

  button.disabled = true;
  button.textContent = "등록하는 중…";

  const saved = await board_insert({
    user_id: user.id,
    name: name,
    img: thumbnailData,
    text: text,
    category: selected ? selected.dataset.cat : null,
    link: firstLink ? firstLink.value.trim() : null,
  });

  if (saved) {
    alert("게시물 생성 완료");
    location.href = `club_detail.html?id=${saved.id}`;
  } else {
    alert("저장하지 못했어요. 다시 시도해 주세요.");
    button.disabled = false;
    button.textContent = "등록하기";
  }
}

function setupForm() {
  // 분야 : 하나만 선택
  document.getElementById("ctg").addEventListener("click", (e) => {
    const btn = e.target.closest(".분야버튼");
    if (!btn) return;
    document.querySelectorAll("#ctg .분야버튼").forEach((b) => b.classList.remove("켜짐"));
    btn.classList.add("켜짐");
  });

  // 한 줄 소개 글자 수
  const summary = document.getElementById("summary");
  summary.addEventListener("input", () => {
    document.getElementById("summary_count").textContent = `${summary.value.length} / 40`;
  });

  // 링크 추가 / 삭제
  const linkBox = document.getElementById("link_line");
  const firstRow = linkBox.querySelector(".링크줄");
  document.getElementById("add_link_btn").addEventListener("click", () => {
    const row = firstRow.cloneNode(true);
    row.querySelector(".입력칸").value = "";
    linkBox.appendChild(row);
  });
  linkBox.addEventListener("click", (e) => {
    if (!e.target.classList.contains("네모버튼")) return;
    const rows = linkBox.querySelectorAll(".링크줄");
    if (rows.length > 1) e.target.closest(".링크줄").remove();
    else e.target.closest(".링크줄").querySelector(".입력칸").value = "";
  });

  // 대표 사진 미리보기
  document.getElementById("thumbnail").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    thumbnailData = await resizeImage(file);
    document.getElementById("thumbnail_preview").innerHTML =
      `<img src="${thumbnailData}" alt="대표 사진 미리보기" style="width:100%;height:100%;object-fit:cover;">`;
  });

  // 활동 사진 미리보기 (아직 저장은 안 됨)
  const grid = document.getElementById("photo_grid");
  const addCell = grid.querySelector(".빈사진칸");
  grid.querySelectorAll(".사진칸").forEach((el) => el.remove()); // 예시 칸 지우기

  function updateCount() {
    const count = grid.querySelectorAll(".사진칸").length;
    document.getElementById("photo_count").textContent = `${count} / 6장`;
    addCell.style.display = count >= 6 ? "none" : "";
  }

  document.getElementById("photos").addEventListener("change", async (e) => {
    for (const file of [...e.target.files]) {
      if (grid.querySelectorAll(".사진칸").length >= 6) break;
      const url = await resizeImage(file, 600);
      const cell = document.createElement("div");
      cell.className = "사진칸";
      cell.innerHTML = `<img src="${url}" alt=""><button type="button" class="삭제버튼" aria-label="사진 삭제">×</button>`;
      grid.insertBefore(cell, addCell);
    }
    e.target.value = "";
    updateCount();
  });

  grid.addEventListener("click", (e) => {
    if (e.target.classList.contains("삭제버튼")) {
      e.target.closest(".사진칸").remove();
      updateCount();
    }
  });

  updateCount();
  document.getElementById("add_dong_form").addEventListener("submit", create);
}

document.addEventListener("DOMContentLoaded", () => {
  const user = getLoginUser();
  if (!user || !user.auth) {
    alert("게시물 생성 권한이 없습니다.");
    location.href = "start_page.html";
    return;
  }
  setupForm();
});
