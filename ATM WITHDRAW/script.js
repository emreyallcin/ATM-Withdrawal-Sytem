class User {
    constructor(pin) {
        this.pin = pin;
    }
    authenticate(enteredPin) {
        return this.pin === enteredPin;
    }
}

class Account {
    constructor(balance) {
        this.balance = balance;
    }
    getBalance() {
        return this.balance;
    }

    deductAmount(amount) {
        if (amount <= this.balance) {
            this.balance -= amount;
            return true;
        }
        return false;
    }
}

class CashDispenser {
    constructor(availableCash) {
        this.availableCash = availableCash;
    }
    dispense(amount) {
        if (amount <= this.availableCash) {
            this.availableCash -= amount;
            return true;
        }
        return false;
    }
}

class Screen {
    static displayMessage(message) {
        document.getElementById("message").textContent = message;
    }
    static displayPinMessage(message) {
        document.getElementById("pinMessage").textContent = message;
    }
    static clearMessage() {
        document.getElementById("message").textContent = "";
    }
}

class Keypad {
    static getInput() {
        const amount = parseFloat(document.getElementById("withdrawAmount").value);
        return isNaN(amount) ? 0 : amount;
    }
    static getPinInput() {
        return document.getElementById("pinInput").value;
    }
}

class ATM {
    constructor(location, branchName, account, cashDispenser, user, screen) {
        this.location = location;
        this.branchName = branchName;
        this.account = account;
        this.cashDispenser = cashDispenser;
        this.user = user;
        this.screen = screen;
    }
    authenticateUser() {
        const enteredPin = Keypad.getPinInput();
        if (this.user.authenticate(enteredPin)) {
            
            document.getElementById("pinScreen").style.display = "none";
            document.getElementById("withdrawScreen").style.display = "block";
            this.screen.displayMessage("");
        } else {
            
            this.screen.displayPinMessage("Incorrect PIN. Please try again.");
        }
    }
    inputDigit(digit) {
        const inputField = document.getElementById("withdrawAmount");
        inputField.value += digit;
        Screen.clearMessage();
    }
    correctInput() {
        const inputField = document.getElementById("withdrawAmount");
        inputField.value = inputField.value.slice(0, -1);
    }
    startWithdrawal() {
        const amount = Keypad.getInput();

        if (amount <= 0) {
            this.screen.displayMessage("Please enter a valid amount.");
            return;
        }
        if (amount > this.account.getBalance()) {
            this.screen.displayMessage("Insufficient funds in your account.");
            return;
        }
        if (!this.cashDispenser.dispense(amount)) {
            this.screen.displayMessage("ATM has insufficient cash.");
            return;
        }

        this.account.deductAmount(amount);
        this.screen.displayMessage(`Transaction successful! Please take your cash. Remaining balance: $${this.account.getBalance()}`);
    }

    cancelTransaction() {
        document.getElementById("withdrawAmount").value = "";
        this.screen.displayMessage("Transaction cancelled.");
    }
}

const user = new User("1234");
const account = new Account(1000);
const cashDispenser = new CashDispenser(5000);
const atm = new ATM("Downtown", "Main Branch", account, cashDispenser, user, Screen);
