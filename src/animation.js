//Animation Initialization 
numbers.forEach(value => {
    value.addEventListener('click', () => {
        value.children[0].classList.add('numberTextScaleAnimation')
    })
})

operators.forEach(value => {
    value.addEventListener('click', e => {
        value.children[0].classList.add('operatorTextScaleAnimation')
    })
})


// Numbers Animation
numbers.forEach(value => {
    value.addEventListener('touchstart', e => {
        value.style.backgroundColor = '#444444'
    })
});

numbers.forEach(value => {
    value.addEventListener('touchend', e => {
        value.children[0].classList.remove('numberTextScaleAnimation')
        value.style.backgroundColor = '#1a1a1a'
    })
})



// Operators Animation
operators.forEach(elem => {
    elem.addEventListener('touchstart', e => {
        elem.style.backgroundColor = '#1a1a1a';
    })
})

operators.forEach(elem => {
    elem.addEventListener('touchend', e => {
        elem.children[0].classList.remove('operatorTextScaleAnimation')
        elem.style.backgroundColor = '#303030';
    })
})



// Clear All Animation

clearAllBtn.addEventListener('click', e => {
    clearAllBtn.children[0].classList.add('numberTextScaleAnimation');
})

clearAllBtn.addEventListener('touchstart', e => {
    clearAllBtn.style.backgroundColor = '#1a1a1a';
})

clearAllBtn.addEventListener('touchend', e => {
    clearAllBtn.children[0].classList.remove('numberTextScaleAnimation');
    clearAllBtn.style.backgroundColor = '#303030';
})