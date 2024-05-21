import { useEffect, useRef } from "react";
import openModal from "../../componets/modal/OpenModal";
import Pagination from "../../componets/services/Pagination ";
import Curso from "./Curso";
import VerCurso from "./VerCurso";
import Buscador from "../../componets/Buscador";

import Swal from "sweetalert2";
import { useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { FaTrashAlt } from "react-icons/fa";
import { TbEdit } from "react-icons/tb";
import { IoMdAdd } from "react-icons/io";
import { FaRegEye } from "react-icons/fa";

export default function ListCurso({ title, accion }) {
  const hostServer = import.meta.env.VITE_REACT_APP_SERVER_HOST;
  const url = `${hostServer}/api/v3/courses`;
  const [selectedItems, setSelectedItems] = useState([]);
  const [page, setPage] = useState(1);
  const [itemsPage, setItemsPage] = useState(8);
  let { data, isLoading, getData, deleteData } = useFetch(`${url}`);
  const bgChange = true;
  const modalNivel = 2;
  const filters = [
    { id: 1, nombre: "codigo", descrip: "Código" },
    { id: 2, nombre: "nombre", descrip: "Nombre" },
  ];
  function handleAddCursos() {
    const tittle = "Adición de Cursos";
    openModal(
      <Curso curso={""} edit={false} riviewList={updateList} />,
      null,
      "medio",
      tittle,
      modalNivel,
      bgChange
    );
  }

  function handleEdit(curso) {
    const tittle = "Edición de Cursos";
    openModal(
      <Curso curso={curso} edit={true} riviewList={updateList} />,
      null,
      "medio",
      tittle,
      modalNivel,
      bgChange
    );
  }

  function handleVer(curso) {
    const tittle = "Consulta de Cursos";
    openModal(
      <VerCurso curso={curso} />,
      null,
      "medio",
      tittle,
      modalNivel,
      bgChange
    );
  }

  const updateList = async () => {
    await getCursos();
  };

  const handleDel = async (id) => {
    const url = `${hostServer}/api/v3/course`;

    const delId = id;
    Swal.fire({
      title: "Está Seguro?",
      text: "Desea eliminar este regístro?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, Eliminar!",
    }).then((result) => {
      if (result.isConfirmed) {
        const borrar = async () => {
          await deleteData(url, delId);
          await Swal.fire({
            title: "Eliminádo!",
            text: "El Curso fué eliminádo.",
            icon: "success",
          });
          getCursos();
        };
        borrar();
      }
    });
  };

  const nextPage = (pagItems, pageCurrent) => {
    setItemsPage(pagItems);
    setPage(pageCurrent);
  };

  const handlePageChange = (newSelectedItems) => {
    setSelectedItems(newSelectedItems);
  };

  const getCursos = async () => {
    const url = `${hostServer}/api/v3/courses`;
    await getData(url);
  };

  useEffect(() => {
    if (data?.message || data?.message != undefined) {
      Swal.fire(data?.message);
    }
  }, [data]);

  useEffect(() => {
    getCursos();
  }, []);

  return (
    <>
      {isLoading ? (
        <h3 className="mt-5">Cargando...</h3>
      ) : (
        selectedItems && (
          <>
            <div className=" container">
              <div className="tittle-search">
                <div className="tittle">{title}</div>
                <div className="search">
                  <Buscador
                    filters={filters}
                    registros={data?.data?.data}
                    onPageChange={handlePageChange}
                  />
                </div>
                <button className="addBtn" onClick={handleAddCursos}>
                  <IoMdAdd />
                </button>
              </div>
              <table className="table table-striped table-bordered">
                <thead>
                  <tr className="table-dark">
                    <th scope="col">Código</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">Costo</th>
                    <th scope="col" colSpan={2}>
                      Acción
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data?.status === 500 ? (
                    <tr>
                      <td scope="col" colSpan={7}>
                        <h3 className="textCenter">
                          No hay información para esta Entidad.
                        </h3>
                      </td>
                    </tr>
                  ) : (
                    selectedItems.map((curso) => {
                      if (accion !== "ver") {
                        return (
                          <tr key={curso._id}>
                            <td>{curso.codigo}</td>
                            <td>{`${curso.nombre}`} </td>
                            <td>{curso.costo}</td>
                            <td>
                              <TbEdit
                                className=".btnShow"
                                style={{ fontSize: "25px" }}
                                onClick={() => handleEdit(curso)}
                              />
                            </td>
                            <td>
                              <FaTrashAlt
                                style={{ fontSize: "25px" }}
                                onClick={() => handleDel(curso._id)}
                              />
                            </td>
                          </tr>
                        );
                      } else {
                        return (
                          <tr key={curso._id}>
                            <td>{curso.codigo}</td>
                            <td>{`${curso.nombre}`} </td>
                            <td>{`${curso.costo}`} </td>
                            <td>
                              <FaRegEye
                                className=".btnShow"
                                style={{ fontSize: "25px" }}
                                onClick={() => handleVer(curso)}
                              />
                            </td>
                          </tr>
                        );
                      }
                    })
                  )}
                </tbody>
              </table>
              {data?.data?.data && (
                <Pagination
                  items={data?.data?.data}
                  page={page}
                  pagItems={itemsPage}
                  nextPage={nextPage}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          </>
        )
      )}
    </>
  );
}
