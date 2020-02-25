let AddressList = require("../../data/address");;
const Store = {

    add: (arg) => {
        AddressList.push(arg);
        console.log(AddressList, 111121313123)
    },
    delete: () => {

    },
    correct: () => {

    }
}

module.exports = { Store, AddressList };
