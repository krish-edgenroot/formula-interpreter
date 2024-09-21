exports.mergeArrays = (...arrays) => {
    return arrays.reduce((a,b)=>[...a,...b],[])
}