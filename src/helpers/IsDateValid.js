export default function isDateValid(obj){
    return obj instanceof Date && !isNaN(obj)
}