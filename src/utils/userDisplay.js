function capitalizeWord(word) {
  if (!word) return "";
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export function getUserDisplayName(user) {
  if (!user) return "Usuario";

  if (user.nombre && user.apellido) {
    return `${user.nombre} ${user.apellido}`.trim();
  }

  if (user.nombre) {
    return user.nombre;
  }

  if (user.nombre_usuario) {
    return user.nombre_usuario
      .split(".")
      .filter(Boolean)
      .map(capitalizeWord)
      .join(" ");
  }

  return "Usuario";
}

export function getUserInitial(user) {
  const displayName = getUserDisplayName(user);
  return displayName.charAt(0).toUpperCase() || "U";
}
