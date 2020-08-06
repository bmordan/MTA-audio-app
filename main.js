const arr_a = [1,2,3,4]
const arr_b = [1,4,3,2]

function are_equal(arr_a, arr_b) {
    let start_slice = 0
    for (let i = 0; i < arr_b.length; i++) {
        if (arr_b[i] !== arr_a[i]) {
            start_slice = i;
            break;
        }
    }
    const part1 = arr_b.slice(0, start_slice)
    const part2 = arr_b.slice(start_slice, arr_b.length)
    
    part1.concat(part2.reverse()).toString() === arr_a.toString()
}
are_equal(arr_a, arr_b)
