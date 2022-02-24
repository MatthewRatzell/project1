const template = document.createElement('template');
template.innerHTML = `
<style>  
h2,h3
{
    
    text-align: center;
    font-size: 2.0rem;
    margin-top: 0;
}
.card 
  {
    overflow:auto;
    padding:5%;
    background-color: #E27D60 !important;
    height: 350px;
    width: 306px;
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
    transition: 0.3s;
  }
  
.card:hover 
  {
    box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
  }

</style>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">
<body>
<div class="card">

    <h2 id="title" class="has-text-centered is-size-5">25</h2>
    <h2 class="has-text-centered is-size-5" id="description">25</h2>
    <h2 id="dueDate" class="has-text-centered is-size-5">25</h2>


</div>
  <body>


`;
// making sure ffavorites is set equal to the local storage
class swCard extends HTMLElement {
  constructor() {
    super();
    // attach a shadowdom treeto this instance this creasts a shadown root for us
    this.attachShadow({ mode: 'open' });// allows debugging when open
    // clone template and append it
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    // making sure we call our render function
    this.render();
  }

  // once we hook this favro
  disconnectedCallback() {

  }

  // updating the code
  attributeChangedCallback(attributeName, oldVal, newVal) {
    console.log(attributeName, oldVal, newVal);
    this.render();
  }

  // telling component to observe/watch these values
  static get observedAttributes() {
    return ['data-title', 'data-description', 'data-duedate'];
  }

  render() {
    this.titleDOM = this.shadowRoot.querySelector('#title');
    this.descriptionDOM = this.shadowRoot.querySelector('#description');
    this.dueDateDOM = this.shadowRoot.querySelector('#dueDate');


    const title = this.getAttribute('data-title') ? this.getAttribute('data-title') : '<i>...game title...</i>';
    const description = this.getAttribute('data-description') ? this.getAttribute('data-description') : '0';
    const dueDate = this.getAttribute('data-duedate') ? this.getAttribute('data-duedate') : '<i>...game title...</i>';


    this.titleDOM.innerHTML = `Title:${title}`;
    this.descriptionDOM.innerHTML = `Description:${description}`;
    this.dueDateDOM.innerHTML = `Due Date:${dueDate}`;

  }
}// end class
customElements.define('sw-card', swCard);
