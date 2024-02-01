export const nameValidation = (str) => {
    if (str.length <= 2) return "name is too short";
    if (str.length >= 200) return "name is too long";
    if (/[._/\\|]/g.test(str))
        return `must not include the characters . _ / \\ |`;
    return null;
};
export const emailValidation = (str) => {
    if (str?.trim().length === 0) return "Enter your mail";
    const arr = str.split("@");
    if (arr.length !== 2 || arr[1].split(".").length !== 2)
        return "must be text@text.text format";
    return null;
};
export const phoneValidation = (num) => {
    if (num.trim() === "") return null;
    if (str.length <= 8) return "number is too short";
    if (str.length >= 17) return "number is too long";
    if (!/^\+?[0-9\s-]+$/.test(yourString))
        return "must not contain extra characters";
    return null;
};

export const passwordValidation = (str) => {
    if (!str?.trim()) return "password cannot be empty";
    if (str.length < 6) return "must be more than 6 characters";
    if (!str.split("").some((e) => Number.isFinite(+e) && e !== " "))
        return "must be at least one digit";
    return null;
};

export const oldPasswordValidation = (str) => {
    if (str === "") return null;
    if (!str?.trim()) return "password cannot be empty";
    if (str.length < 6) return "must be more than 6 characters";
    if (!str.split("").some((e) => Number.isFinite(+e) && e !== " "))
        return "must be at least one digit";
    return null;
};

export const isRequired = (val) => {
    return !val?.trim() ? "field cannot be empty" : null;
};

export const isNumber = (val) => {
    return isNaN(Number(val)) ? "Must be a valid number" : null;
};

export const isPositiveNumber = (val) => {
    const number = Number(val);
    return isNaN(number) || number <= 0 ? "Must be a positive number" : null;
};

export const minString = (limit) => (val) => {
    return val.length <= limit ? `must be less than ${limit} characters` : null;
};

export const maxString = (limit) => (val) => {
    return val.length >= limit ? `must be more than ${limit} characters` : null;
};

export default {
    isRequired,
    nameValidation,
    emailValidation,
    passwordValidation,
    phoneValidation,
    maxString,
    minString,
    isNumber,
    isPositiveNumber,
};
