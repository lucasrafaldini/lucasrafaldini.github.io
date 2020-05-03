
window.addEventListener('load', () => {
    
})

function gridClick(event){
    window.open(event.target.attributes.link.value)
    console.log(event.target.attributes.link.value)
}