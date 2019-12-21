export class ToggleButton {
    element;
    active;

    onactivation;
    ondeactivation;

    constructor(content, container, x, y, type = null) {
        this.element = document.createElement("button");
        this.element.textContent = content;

        this.active = false;
        this.element.onclick = () => {
            this.active = !this.active;

            if (!this.active) {
                this.element.classList.remove("active");
                this.ondeactivation();
            } else {
                this.element.classList.add("active");
                this.onactivation();
            }
        };

        this.element.style.top = null;
        this.element.style.left = null;
        this.element.style.bottom = null;
        this.element.style.right = null;

        switch (type) {
            case "BR":
                this.element.style.right = x + "px";
                this.element.style.bottom = x + "px";
                break;
            case "BL":
                this.element.style.left = x + "px";
                this.element.style.bottom = y + "px";
                break;
            case "TR":
                this.element.style.right = x + "px";
                this.element.style.top = y + "px";
                break;
            case "TL":
            default:
                this.element.style.left = x + "px";
                this.element.style.top = y + "px";
        }

        container.append(this.element);
    }
}
