const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(500).json({ msg: "Error al verificar el rol del usuario." });
    }

    if (!roles.includes(req.usuario.rol)) {
      return res.status(403).json({ msg: `Acceso denegado: se requiere rol de ${roles.join(" o ")}.` });
    }

    next();
  };
};

export default checkRole;
