// =====================================================
// club_detail.js : 동아리 상세 (club_detail.html?id=번호)
// DB에서 채우는 것 : 이름, 분야, 대표 사진, 소개 글, 링크
// 정원·지원·한 줄 소개·영상·사진·지원하기는 DB 칸이 없어서 화면만
// =====================================================

async function loadClub(id) {
  const { data, error } = await DB.from("board").select("*").eq("id", id).maybeSingle();
  if (error) {
    console.log("에러 : ", error);
    return null;
  }
  return data;
}

async function setupDetail() {
  const id = new URLSearchParams(location.search).get("id");
  const club = id ? await loadClub(id) : null;

  if (!club) {
    document.getElementById("club_name").textContent = "동아리를 찾을 수 없어요";
    return;
  }

  document.title = `${club.name} | 미림 동아리`;

  // 이름, 분야 (textContent라서 안전)
  document.getElementById("club_name").textContent = club.name || "이름 없음";
  document.getElementById("club_category").textContent = club.category || "";
  document.getElementById("club_category_path").textContent = club.category || "";

  // 대표 사진
  if (isImageURL(club.img)) {
    document.getElementById("club_thumbnail").innerHTML =
      `<img src="${escapeHTML(club.img)}" alt="${escapeHTML(club.name)} 대표 사진">`;
  }

  // 소개 글 : 줄마다 문단 나누기
  const paragraphs = String(club.text ?? "").split(/\n+/).filter((p) => p.trim());
  document.getElementById("club_description").innerHTML = paragraphs.length
    ? paragraphs.map((p) => `<p>${escapeHTML(p)}</p>`).join("")
    : `<p class="캡션">아직 소개 글이 없어요.</p>`;

  // 링크 : http로 시작할 때만 버튼으로
  if (/^https?:\/\//.test(club.link || "")) {
    document.getElementById("club_links").innerHTML =
      `<a href="${escapeHTML(club.link)}" target="_blank" rel="noopener">링크 열기 ↗</a>`;
  }
}

document.addEventListener("DOMContentLoaded", setupDetail);
