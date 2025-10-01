export function formatDate(date){
    return date.toLocaleDateString("en-NZ", {
        month: "short",
        day: "numeric", 
        year: "numeric"
    })
}