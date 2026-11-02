// =====================================================
// club_list.js : 동아리 카드 목록 (시작화면, 전체 동아리)
// 분야 필터, 검색, 페이지 나누기
// =====================================================

const PAGE_SIZE = 8;

// 카드 하나 HTML
function cardHTML(club) {
  const photo = isImageURL(club.img)
    ? `<img src="${escapeHTML(club.img)}" alt="" style="width:100%;height:100%;object-fit:cover;">`
    : "[동아리 사진]";

  // 소개 글은 카드에선 앞부분만
  let short = String(club.text ?? "");
  if (short.length > 40) short = short.slice(0, 40) + "…";

  // 아랫줄 : 정원·지원 칸이 DB에 아직 없어서 자리만 ("-")
  const bottom = `<div class="아랫줄"><span>정원 -명</span><span>지원 -명</span></div>`;

  return `
    <a href="club_detail.html?id=${encodeURIComponent(club.id)}" class="카드">
      <div class="사진자리">${photo}</div>
      <div class="내용">
        <div class="윗줄">
          <h3 class="카드제목">${escapeHTML(club.name || "이름 없음")}</h3>
          <span class="카테고리태그">${escapeHTML(club.category)}</span>
        </div>
        <p class="작은본문">${escapeHTML(short)}</p>
        ${bottom}
      </div>
    </a>`;
}

async function setupClubList() {
  const grid = document.getElementById("card_grid");
  if (!grid) return;

  grid.innerHTML = `<p class="빈결과">불러오는 중…</p>`;

  const clubs = await loadClubs();
  if (!clubs) {
    grid.innerHTML = `<p class="빈결과">동아리 목록을 불러오지 못했어요.</p>`;
    return;
  }

  const categories = getCategories(clubs);
  const limit = Number(grid.dataset.limit) || 0; // 시작화면은 4개

  let current = new URLSearchParams(location.search).get("cat") || "전체";
  let keyword = "";
  let page = 1;

  // ----- 분야 버튼 -----
  const tabBox = document.getElementById("category_tabs");
  tabBox.innerHTML = ["전체", ...categories]
    .map((cat) => `<button type="button" class="분야버튼" data-cat="${escapeHTML(cat)}">${escapeHTML(cat)}</button>`)
    .join("");

  tabBox.addEventListener("click", (e) => {
    const btn = e.target.closest(".분야버튼");
    if (!btn) return;
    current = btn.dataset.cat;
    page = 1;
    render();
  });

  // ----- 검색 -----
  const searchForm = document.getElementById("search_form");
  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      keyword = document.getElementById("search_input").value.trim();
      page = 1;
      render();
    });
  }

  // ----- 페이지 번호 -----
  const pager = document.getElementById("pager");
  if (pager) {
    pager.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      page = Number(btn.dataset.page);
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function render() {
    let list = clubs.filter((c) => current === "전체" || c.category === current);

    if (keyword) {
      list = list.filter((c) =>
        [c.name, c.text, c.category].some((v) => String(v ?? "").includes(keyword))
      );
    }

    const countEl = document.getElementById("result_count");
    if (countEl) countEl.textContent = list.length;

    let shown = list;
    if (limit) {
      shown = list.slice(0, limit);
    } else if (pager) {
      const start = (page - 1) * PAGE_SIZE;
      shown = list.slice(start, start + PAGE_SIZE);
    }

    grid.innerHTML = shown.length
      ? shown.map(cardHTML).join("")
      : `<p class="빈결과">조건에 맞는 동아리가 없어요.</p>`;

    tabBox.querySelectorAll(".분야버튼").forEach((btn) => {
      btn.classList.toggle("켜짐", btn.dataset.cat === current);
    });

    if (pager) {
      const total = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
      let html = "";
      for (let i = 1; i <= total; i++) {
        html += `<button type="button" data-page="${i}" class="${i === page ? "현재" : ""}">${i}</button>`;
      }
      pager.innerHTML = html;
    }
  }

  render();

  // ----- 시작화면 "분야별로 보기" -----
  const catList = document.getElementById("category_list");
  if (catList) {
    catList.innerHTML = categories
      .map((cat) => {
        const count = clubs.filter((c) => c.category === cat).length;
        return `
          <a href="clubs.html?cat=${encodeURIComponent(cat)}" class="분야줄">
            <span>${escapeHTML(cat)}</span>
            <span class="캡션">${count}개 →</span>
          </a>`;
      })
      .join("");
  }

  const totalEl = document.getElementById("total_count");
  if (totalEl) totalEl.textContent = clubs.length;
}

document.addEventListener("DOMContentLoaded", setupClubList);
