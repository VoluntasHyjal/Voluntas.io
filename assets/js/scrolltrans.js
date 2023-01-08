const ratio = .1
const options = {
    root: null,
    rootMargin: '0px',
    threshold: ratio
}

const handleIntersect = function (entries, observer) {
    entries.forEach(function (entry) {
        if (entry.IntersectionRatio > ratio) {
        entry.target.classlist.remove('reveal')
        observer.unobserve(entry.target)
        }
    })
}

const observer = new IntersectionObserver(handleIntersect,options)
document.querySelectorAll('[class*="reveal-"]').forEach(function (r) {
    observer.observe(r)
})

//$(document).ready(function() {
    // var defaults = {
    // 	containerID: 'toTop', // fading element id
    // 	containerHoverID: 'toTopHover', // fading element hover id
    // 	scrollSpeed: 1200,
    // 	easingType: 'linear'
    // };

  //  $().UItoTop({ easingType: 'easeOutQuart' });
//});