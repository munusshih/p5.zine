function setup() {
  createZine("2.75in", "4.25in", {
    title: "My Zine",
    accentColor: "#7c3aed",
    cam: false,
  });

  const colors = ["#7c3aed", "#f0e9ff", "#ffefe1", "#e5f4e9", "#7c3aed"];
  all.forEach((page, index) => page.background(colors[index]));

  cover.fill("white");
  cover.textSize(36);
  cover.text("My Zine", 24, 64);
  one.fill("#312052");
  one.textSize(20);
  one.text("Draw here", 24, 48);
}
