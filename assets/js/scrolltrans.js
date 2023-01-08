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
document.documentElement.classlist.add('reveal-loaded')
const observer = new IntersectionObserver(handleIntersect,options)
document.querySelectorAll('[class*="reveal-"]').forEach(function (r) {
    observer.observe(r)
})