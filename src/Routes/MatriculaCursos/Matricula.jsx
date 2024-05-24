import { useState, useEffect, useRef } from "react";
import { useFetch } from "../../hooks/useFetch";
import { useForm } from "../../hooks/useForm";

import Swal from "sweetalert2";
import { useAppContext } from "../../hooks/appContext";
import ValidateErrors from "../../componets/services/ValidateErrors";
import validationSchema from "../../componets/services/validationSchema";

export default function Curso({ matricula, edit, riviewList }) {
  const { HandleNivelClose } = useAppContext();
  const hostServer = import.meta.env.VITE_REACT_APP_SERVER_HOST;
  const api = `${hostServer}/api/v3/matricula`;
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(false);
  const initialForm = {
    id: matricula ? matricula._id : 0,
    curso: matricula ? matricula.curso : "",
    profesor: matricula ? matricula.profesor : "",
    student: matricula ? matricula.student : "",
    turno: matricula ? matricula.turno : "",
    finicio: matricula ? matricula.finicio : "",
    ffin: matricula ? matricula.ffin : "",
  };

  let { formData, onInputChange, validateForm, errorsInput, clearForm } =
    useForm(initialForm, validationSchema);

  const { id, curso, profesor, student, turno, finicio, ffin } = formData;

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

    if (!numError) {
      let url = `${api}`;
      if (!edit) {
        await createData(url, formData);
      } else {
        await updateData(url, matricula._id, formData);
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
        riviewList();
      }
    }
  }, [data]);

  const getCourses = async () => {
    let url = `${hostServer}/api/v3/courses`;
    let response = await fetch(url);
    let responseCurso = await response.json();
    console.log(responseCurso);
    if (async () => await responseCurso.data) {
      setCourses(responseCurso.data);
    }

    cargaTeacher(responseCurso?.data[0].profesores);

    url = `${hostServer}/api/v3/students`;
    response = await fetch(url);
    let responseData = await response.json();
    if (async () => await responseData.data) {
      setStudents(responseData.data);
    }
  };

  const onInputChangeCourse = (event) => {
    const slectCourse = event.target.value;
    const selectRegister = courses.filter(
      (item) => item.nombre === slectCourse
    );
    cargaTeacher(selectRegister[0].profesores);
    onInputChange(event);
  };

  const cargaTeacher = (teacher) => {
    setTeachers(teacher);
  };
  useEffect(() => {
    getCourses();
  }, []);

  return (
    <>
      {
        // isLoading ? (
        // <h3>Cargando...</h3>
        // ) :
        error ? (
          errorMessage()
        ) : (
          <div className="container my-5 px-5">
            <form onSubmit={handleSubmit}>
              <section>
                <aside>
                  <div className="row mt-5">
                    <div className="form-group col-md-12">
                      <label htmlFor="curso"> Nombre del Curso </label>
                      <select
                        name="curso"
                        className="form-control"
                        value={curso}
                        onChange={onInputChangeCourse}
                      >
                        <option>Seleccione una opción</option>
                        {courses.map((item) => (
                          <option
                            key={item.id}
                            value={item.nombre}
                          >{`${item.nombre}`}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="row mt-3">
                    <div className="form-group col-md-12">
                      <label htmlFor="profesor">
                        Nombre del Profesor Asignado al Curso
                      </label>
                      <select
                        name="profesor"
                        className="form-control"
                        value={profesor}
                        onChange={onInputChange}
                      >
                        <option>Seleccione el Profesor</option>
                        {teachers.map(
                          (item) =>
                            item.profesor && (
                              <option
                                key={item.id}
                              >{`${item.profesor}`}</option>
                            )
                        )}
                      </select>
                    </div>
                  </div>

                  <div className="row mt-3">
                    <div className="form-group col-md-12">
                      <label htmlFor="profesor">Nombre del Alumno</label>
                      <select
                        name="student"
                        className="form-control"
                        value={student}
                        onChange={onInputChange}
                      >
                        <option>Seleccione Alumno</option>
                        {students.map((item) => (
                          <option
                            key={item.id}
                          >{`${item.nombre} ${item.apellido}`}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="form-group col-md-12">
                      <label htmlFor="turno">Seleccione el Turno</label>
                      <select
                        name="turno"
                        className="form-control"
                        value={turno}
                        onChange={onInputChange}
                      >
                        <option>Seleccióne opción</option>
                        <option>Mañana</option>
                        <option>Tarde</option>
                        <option>Noche</option>
                      </select>
                    </div>
                  </div>

                  <div className="row mt-3">
                    <div className="form-group col-md-6">
                      <label htmlFor="finicio">Fecha de Início.</label>
                      <input
                        type="text"
                        className="form-control"
                        name="finicio"
                        placeholder="Indique la fecha de início"
                        value={finicio}
                        onChange={onInputChange}
                      />
                    </div>

                    <div className="form-group col-md-6">
                      <label htmlFor="ffin">Fecha de Finalización.</label>
                      <input
                        type="text"
                        className="form-control"
                        name="ffin"
                        placeholder="Indique la fecha de início"
                        value={ffin}
                        onChange={onInputChange}
                      />
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
