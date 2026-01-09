document.addEventListener("click", (event) => {
  if (event.target.dataset.type === "remove") {
    const id = event.target.dataset.id;

    remove(id).then(() => {
      event.target.closest("li").remove();
    });
  } else if (event.target.dataset.type === "edit") {
    const id = event.target.dataset.id;
    const oldTitle = event.target.closest("li").getAttribute("value");
    const newTitle = prompt("Введите новое название", oldTitle);

    if (newTitle && newTitle !== oldTitle) {
      editTitle(id, newTitle).then(() => {
        event.target.closest("li").setAttribute("value", newTitle);
        const clientTitle = event.target.closest("li").innerHTML;
        event.target.closest("li").innerHTML = clientTitle.replace(
          oldTitle,
          newTitle
        );
      });
    }
  }
});

async function remove(id) {
  await fetch(`/${id}`, {
    method: "DELETE",
  });
}

async function editTitle(id, title) {
  if (title) {
    await fetch(`/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({
        title,
        id,
      }),
    });
  }
}
