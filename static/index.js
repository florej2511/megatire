
const boardingVideo = document.getElementById('boarding-video');
const overlayVideo = document.getElementById('overlay-video');
const overlayChildren = ['bg-black', 'bg-opacity-70']

const aboutUsContainer = document.getElementById('about_us')


overlayVideo.addEventListener('mouseover', () => {
    overlayVideo.childNodes.forEach((child) => {
        if (child.classList) {
            child.classList.add(...overlayChildren)
        }
    })
})
overlayVideo.addEventListener('mouseleave', () => {
    overlayVideo.childNodes.forEach((child) => {
        if (child.classList) {
            child.classList.remove(...overlayChildren)
        }
    })
})


new ImageSlider('.slide', '.btn-slide').repeat()

const placeClient = (element) => {

    const clientContainer = document.getElementById('client_said')
    clientContainer.classList.add('scale-0')
    const client_element = document.getElementById('client_name')
    const client_dscp = document.getElementById('client_description')
    setTimeout(() =>  {
        client_element.innerText = element.children[0].innerHTML.trim()
        client_dscp.innerHTML = element.children[1].innerHTML.trim()
        clientContainer.classList.remove('scale-0')
    }, 200)
}

const container = document.getElementById('first_comment')
container.click()