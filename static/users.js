const register = async (login, password) => {
  const res = await fetch("/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify({ login, password }),
  });
};

const auth = async (login, password) => {
  const res = await fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify({ login, password }),
  });
  const profile = await res.json();
  return profile;
};
