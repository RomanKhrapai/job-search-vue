export const nameValidation = (str) => {
    if (str.length <= 2) return "name is too short";
    if (str.length >= 200) return "name is too long";
    if (/[. _ / \\ |]/g.test(str))
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
    if (num.trim() === "") return "number cannot be empty";
    if (!Number.isFinite(+num)) return "can only be a number";
    if (str.length <= 6) return "number is too short";
    if (str.length >= 15) return "number is too long";
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

export const isRequired = (val) => {
    return !val?.trim() ? "field cannot be empty" : null;
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
};
