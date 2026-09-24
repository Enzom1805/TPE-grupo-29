export default function Checkbox(name){
    const checkbox = document.createElement("input");

    checkbox.type = "checkbox";
    checkbox.name = name;

    return checkbox;
}
