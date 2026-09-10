// const DB_URL = "https://woobttpshqvkjnjvhvis.supabase.co";
// const DB_KEY = "sb_publishable_Xx2zd7IeOrekFvPFYQLrXQ_0l61qoNe";

// const DB = window.supabase.createClient(DB_URL, DB_KEY);

// async function insert_user() {
//   const { data, error } = await DB.from("user").insert([{}]);
// }

function accession() {
  const user = {
    id: document.getElementById("user_id").value,
    pw: document.getElementById("user_pw").value,
    pw2: document.getElementById("user_pw2").value,
    name: document.getElementById("user_name").value,
    num: document.getElementById("user_num").value,
    auth: false,
  };
  console.log(user);
}
