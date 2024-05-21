import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./menu.css"; // Archivo CSS donde definiremos los estilos

function MenuItem({ item }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="menuItem">
      <div onClick={handleToggle} className="menuItemTitle">
        <Link to={item.route}>{item.title}</Link>
      </div>
      {isOpen && (
        <ul className="submenu">
          {item.subItems.map((subItem) => (
            <li key={subItem.title} className="submenuItem">
              <Link to={subItem.route}>{subItem.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Menu() {
  const menuItems = [
    {
      title: "Home",
      route: "/",
      subItems: [],
    },
    {
      title: "Estudiante",
      subItems: [
        { title: "Registro", route: "/register" },
        { title: "Perfíl", route: "/perfil" },
      ],
    },
    {
      title: "Administración",
      subItems: [
        { title: "Gestión de Cursos", route: "/cursos" },
        { title: "Gestión de Estudiante", route: "/students" },
        { title: "Gestión de Proferores", route: "/teachers" },
        { title: "Matriculación de Cursos", route: "/matricula" },
        { title: "Usuários", route: "/users" },
        { title: "Contactos", route: "/contact" },
      ],
    },
    {
      title: "Listados",
      subItems: [
        { title: "Cursos", route: "/vecurso" },
        { title: "Estudiantes por Curso", route: "/matricula" },
      ],
    },
    {
      title: "Accesos",
      subItems: [
        { title: "Inicio Sesión", route: "/login" },
        { title: "Cambio de Clave", route: "/cambioClave" },
        { title: "Salir", route: "/Logout" },
      ],
    },
  ];

  return (
    <div className="menu">
      {menuItems.map((item) => (
        <MenuItem key={item.title} item={item} />
      ))}
    </div>
  );
}

export default Menu;
