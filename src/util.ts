//inserts a string at a location in a string, returns the new string
function str_insert_at(str: string, index: number, insert: string) {
    return str.substring(0, index) + insert + str.substring(index + 1);
}
