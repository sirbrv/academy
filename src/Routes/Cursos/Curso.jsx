import { useState, useEffect, useRef } from "react";
import { useFetch } from "../../hooks/useFetch";
import { useForm } from "../../hooks/useForm";
import Swal from "sweetalert2";
import { useAppContext } from "../../hooks/appContext";
import ValidateErrors from "../../componets/services/ValidateErrors";
import validationSchema from "../../componets/services/validationSchema";

export default function Curso({ curso, edit, riviewList }) {
  const hostServer = import.meta.env.VITE_REACT_APP_SERVER_HOST;
  const { HandleNivelClose } = useAppContext();
  const api = `${hostServer}/api/v3/course`;
  let urlImage = "s";
  const [teachers, setTeachers] = useState([]);
  const [error, setError] = useState(false);
  const initialForm = {
    id: curso ? curso._id : "",
    codigo: curso ? curso.codigo : "",
    nombre: curso ? curso.nombre : "",
    descripcion: curso ? curso.descripcion : "",
    costo: curso ? curso.costo : "",
    condicion: curso ? curso.condicion : "",
    duracion: curso ? curso.duracion : "",
    clasificacion: curso ? curso.clasificacion : "",
  };
  const [imageCourse, setImageCourse] = useState(null);
  const [urlImageCourse, setUrlImageCourse] = useState(
    curso ? curso.urlImagen : null
  );
  const [profesores, setProfesores] = useState([
    {
      id: 1,
      profesor: curso.profesores ? curso?.profesores[0]?.profesor : "",
      costoHora: curso.profesores ? curso?.profesores[0]?.costoHora : "",
    },
    {
      id: 2,
      profesor: curso.profesores ? curso?.profesores[1]?.profesor : "",
      costoHora: curso.profesores ? curso?.profesores[1]?.costoHora : "",
    },
    {
      id: 3,
      profesor: curso.profesores ? curso?.profesores[2]?.profesor : "",
      costoHora: curso.profesores ? curso?.profesores[2]?.costoHora : "",
    },
    {
      id: 4,
      profesor: curso.profesores ? curso?.profesores[3]?.profesor : "",
      costoHora: curso.profesores ? curso?.profesores[3]?.costoHora : "",
    },
  ]);
  const handdleImg = (e) => {
    setImageCourse(e.target.files[0]);
  };
  let { formData, onInputChange, validateForm, errorsInput, clearForm } =
    useForm(initialForm, validationSchema);

  const {
    id,
    codigo,
    nombre,
    descripcion,
    costo,
    condicion,
    duracion,
    clasificacion,
  } = formData;

  let {
    data,
    isLoading = false,
    getData,
    createData,
    updateData,
  } = useFetch(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numError = validateForm();
    handleInputChange();
    if (!numError) {
      await handleSubImg();
      formData = { ...formData, urlImage };
      formData = { ...formData, profesores };
      let urlServer = `${api}`;
      if (!edit) {
        await createData(urlServer, formData);
      } else {
        await updateData(urlServer, curso._id, formData);
      }
    } else {
      Swal.fire({
        position: "top",
        icon: "info",
        title: "Debes corregir la información para poder registrarla",
        showConfirmButton: false,
        timer: 5000,
      });
    }
  };

  const handleSubImg = async () => {
    const formData = new FormData();
    formData.append("imageCourse", imageCourse);
    const urlServer = `${hostServer}/api/v3/image`;
    try {
      const response = await fetch(urlServer, {
        method: "POST",
        body: formData,
      });
      const respuesta = await response.json();
      urlImage = await respuesta.urlImage;
      //  setUrlImageCourse(urlImage);
    } catch (error) {
      console.error("Error al subir la imagen:", error);
    }
  };

  useEffect(() => {
    if (data?.message) {
      data?.message &&
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: data?.message,
          showConfirmButton: false,
          timer: 3500,
        });
    } else {
      if (data?.status === 200 || data?.status === 201) {
        data?.data.message &&
          Swal.fire({
            position: "top",
            icon: "success",
            title: data?.data?.message,
            showConfirmButton: false,
            timer: 3500,
          });
      } else {
        data?.data.message &&
          Swal.fire({
            position: "top",
            icon: "warning",
            title: data?.data?.message,
            showConfirmButton: false,
            timer: 3500,
          });
      }
      if (data?.status === 200) {
        HandleNivelClose();
        riviewList();
      }
      if (data?.status === 201) {
        clearForm();
        setProfesores([
          { id: 1, profesor: "", costoHora: "" },
          { id: 2, profesor: "", costoHora: "" },
          { id: 3, profesor: "", costoHora: "" },
          { id: 4, profesor: "", costoHora: "" },
        ]);
        riviewList();
      }
    }
  }, [data]);

  // useEffect(() => {
  //   setUrlImageCourse(urlImage.CourseImg);
  // }, [urlImage]);

  const getTeachers = async () => {
    const urlServer = `${hostServer}/api/v3/teachers`;
    const response = await fetch(urlServer);
    const responseData = await response.json();
    if (async () => await responseData.data) {
      setTeachers(responseData.data);
    }
  };

  useEffect(() => {
    getTeachers();
  }, []);

  const handleInputChange = (id, field, value) => {
    setProfesores((prevProfesores) => {
      const nombreExistente = prevProfesores.find(
        (profesor) => profesor.profesor === value
      );
      const costoHoraAnteriorVacio =
        prevProfesores[id - 2] && !prevProfesores[id - 2].costoHora;
      const profesorVacio =
        prevProfesores[id - 1] && !prevProfesores[id - 1].profesor;
      if (
        (nombreExistente?.profesor && nombreExistente) ||
        costoHoraAnteriorVacio
      ) {
        if (costoHoraAnteriorVacio) {
          Swal.fire({
            position: "top",
            icon: "warning",
            title: "Debe indicar los datos del profesor anterior.",
            showConfirmButton: false,
            timer: 4000,
          });
        }
        if (prevProfesores && profesorVacio) {
          if (prevProfesores[id - 1].profesor) {
            Swal.fire({
              position: "top",
              icon: "warning",
              title: "Debe indicar el profesor de la casílla anterior",
              showConfirmButton: false,
              timer: 4000,
            });
          }
        }
        if (nombreExistente?.profesor && nombreExistente) {
          Swal.fire({
            position: "top",
            icon: "warning",
            title: "El profesor seleccionado ya fué incluído",
            showConfirmButton: false,
            timer: 4000,
          });
        }
        return prevProfesores;
      }

      return prevProfesores.map((profesor) => {
        if (profesor.id === id) {
          return { ...profesor, [field]: value };
        }
        return profesor;
      });
    });
  };

  return (
    <>
      {
        // isLoading ? (
        // <h3>Cargando...</h3>
        // ) :
        error ? (
          errorMessage()
        ) : (
          <div className="container pt-5 px-5 pb-3">
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <section className="courseSection">
                <aside className="px-2">
                  <div className="row">
                    <div className="form-group col-md-12">
                      <label htmlFor="codigo">Código del Curso</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Ingrese el código asignado al curso"
                        name="codigo"
                        value={codigo}
                        onChange={onInputChange}
                      />
                      {errorsInput.codigo && (
                        <ValidateErrors errors={errorsInput.codigo} />
                      )}
                    </div>
                  </div>
                  <div className="row mt-2">
                    <div className="form-group col-md-12">
                      <label htmlFor="nombre">Nombres </label>
                      <input
                        type="text"
                        className="form-control"
                        name="nombre"
                        placeholder="Ingrese Nombres"
                        value={nombre}
                        onChange={onInputChange}
                      />
                      {errorsInput.nombre && (
                        <ValidateErrors errors={errorsInput.nombre} />
                      )}{" "}
                    </div>
                  </div>
                  <div className="row mt-2">
                    <div className="form-group col-md-12">
                      <label htmlFor="costo">Costo del curso</label>
                      <input
                        type="costo"
                        className="form-control"
                        name="costo"
                        placeholder="Ingrese el costo del curso..."
                        value={costo}
                        onChange={onInputChange}
                      />
                      {errorsInput.costo && (
                        <ValidateErrors errors={errorsInput.costo} />
                      )}
                    </div>
                  </div>
                  <div className="row mt-2">
                    <div className="form-group col-md-12">
                      <label htmlFor="condicion">Estátus</label>
                      <select
                        name="condicion"
                        className="form-control"
                        value={condicion}
                        onChange={onInputChange}
                      >
                        <option>Seleccióne opción</option>
                        <option>Actívo</option>
                        <option>No Actívo</option>
                      </select>
                    </div>
                  </div>
                  <div className="row mt-2">
                    <div className="form-group col-md-12">
                      <label htmlFor="duracion">Duración del curso</label>
                      <input
                        type="duracion"
                        className="form-control"
                        name="duracion"
                        placeholder="Ingrese la duración del curso,,"
                        value={duracion}
                        onChange={onInputChange}
                      />
                      {errorsInput.duracion && (
                        <ValidateErrors errors={errorsInput.duracion} />
                      )}
                    </div>
                  </div>
                  <div className="row mt-2">
                    <div className="form-group col-md-12">
                      <label htmlFor="clasificacion">
                        Clasificación del curso
                      </label>
                      <input
                        type="clasificacion"
                        className="form-control"
                        name="clasificacion"
                        placeholder="Indique la Clasificacion del curso,,"
                        value={clasificacion}
                        onChange={onInputChange}
                      />
                      {errorsInput.clasificacion && (
                        <ValidateErrors errors={errorsInput.clasificacion} />
                      )}
                    </div>
                  </div>
                  <div className="row mt-2">
                    <label
                      htmlFor="teacher "
                      className="teacherGrup mt-2 from-grup"
                    >
                      Asignación de Profesores{" "}
                    </label>
                    {profesores.map((profesor) => (
                      <div key={profesor.id} className="form-group col-md-6">
                        <label
                          htmlFor={`nombre-${profesor.id}`}
                          className=" mt-2"
                        >
                          Profesor {profesor.id}
                        </label>
                        <select
                          name={`profesor${profesor.id}`}
                          className="form-control"
                          value={profesor.profesor}
                          onChange={(e) =>
                            handleInputChange(
                              profesor.id,
                              "profesor",
                              e.target.value
                            )
                          }
                        >
                          <option></option>
                          {teachers.map((item) => (
                            <option
                              key={item.id}
                            >{`${item.nombre} ${item.apellido}`}</option>
                          ))}
                        </select>
                        <label
                          htmlFor={`costoHora-${profesor.id}`}
                          className=" mt-2"
                        >
                          Costo Hora
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id={`costoHora-${profesor.id}`}
                          value={profesor.costoHora}
                          onChange={(e) =>
                            handleInputChange(
                              profesor.id,
                              "costoHora",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    ))}
                  </div>
                </aside>
                <aside>
                  <div className="form-group col-md-12">
                    <div className="form-group col-md-12">
                      <label htmlFor="inputName">Descripción Ampliada </label>
                      <textarea
                        rows={18}
                        type="text"
                        className="form-control"
                        name="descripcion"
                        placeholder="Indique los detalles del curso"
                        value={descripcion}
                        onChange={onInputChange}
                      />
                      {errorsInput.descripcion && (
                        <ValidateErrors errors={errorsInput.descripcion} />
                      )}
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="file"
                      className="block text-sm font-medium text-gray-700"
                    ></label>
                    <div className="mt-2 flex items-center">
                      <label htmlFor="file-input" className="upload">
                        <span>Subir Fotos </span>
                      </label>
                      <label htmlFor="file-input" className="upload">
                        <input
                          type="file"
                          name="imageCourse"
                          id="imageCourse"
                          accept=".jpg,.jpeg,.png"
                          onChange={handdleImg}
                          className="inputUpLoad"
                        />{" "}
                      </label>

                      <span className="inline-block h-8 w-8 rounded-full overflow-hidden">
                        {imageCourse ? (
                          <img
                            src={URL.createObjectURL(imageCourse)}
                            alt="file"
                            className="upLoadImg"
                          />
                        ) : (
                          <img
                            src={`${hostServer}${urlImageCourse}`}
                            alt="file"
                            className="upLoadImg"
                          />
                        )}
                      </span>
                    </div>
                  </div>
                </aside>
              </section>

              <div className="btn-submit">
                {edit ? (
                  <button type="submit" className="btn btn-primary w-100">
                    Actualizar
                  </button>
                ) : (
                  <button type="submit" className="btn btn-success w-100">
                    Agregar
                  </button>
                )}
              </div>
            </form>
          </div>
        )
      }
    </>
  );
}
