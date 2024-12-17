// HTML-----------------------------------------
document.addEventListener("DOMContentLoaded", function () {document.body.innerHTML += `

<base target="_blank">
<nav>
    <div class="title">
    <h1 id="genTitle">GenZ(ine)</h1>
    <h2 id="author">by Munus Shih</h2>
  </div>
</nav>

  <div class="desktop">
    <input type="button" value="*download .jpg*" id="download-jpg"
      class="button alt" />
    <input type="button" value="*download .pdf*" id="download-pdf"
      class="button alt" />
  </div>


<div class="label" id="nav-label"><a href="https://github.com/munusshih/p5.genzine" target="_blank" rel="noopener noreferrer">>made with
    p5.(gen)zine</a></div>

<div id="myCanvas"></div>
<footer>
  <div class="label" id="footer-label">
    This zine is about...
  </div>

  <p id="des">
    This zine is about...
  </p>

</footer>`});