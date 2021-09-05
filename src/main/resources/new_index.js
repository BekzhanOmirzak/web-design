export class Animal {
    constructor(name, email) {
        this._name = name;
        this._email = email;
    }

    constructor(name) {
        this._name = name;
    }

    get name() {
        return this._name;
    }

    get email() {
        return this._email;
    }


}

export function addTwoValues(a, b) {
    return a + b;
}