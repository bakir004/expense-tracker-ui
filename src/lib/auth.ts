export const isAuthenticated = () => {
    return document.cookie
        .split(";")
        .some((item) => item.trim().startsWith("jwt="));
};
