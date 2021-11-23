const usuariosCTLR = require('../controllers/usuarios');
const eventosCTLR = require('../controllers/eventos');
const iniciativasCTLR = require('../controllers/iniciativas');
const postulacionesCTLR = require('../controllers/postulaciones');
const medicionesCTLR = require('../controllers/mediciones');
const mercadopagoAPI = require('../controllers/mercadopago');
const emailCTLR = require('../controllers/email');

const auth = require('../controllers/authorization');

module.exports = (app) => {
  // Usuarios
  app.post('/api/usuarios/autenticar', usuariosCTLR.autenticar);
  app.post('/api/usuarios/modificar', auth.administrador, usuariosCTLR.modificarUsuario);
  app.get('/api/usuarios/listar', auth.administrador, usuariosCTLR.listarUsuarios);
  // Administradores
  app.post('/api/administradores/crear', usuariosCTLR.crearAdministrador);
  app.post('/api/administradores/modificar', auth.administrador, usuariosCTLR.modificarAdministrador);
  app.get('/api/administradores/ver/id=:id', auth.administrador, usuariosCTLR.verAdministrador);
  app.get('/api/administradores/listar', auth.administrador, usuariosCTLR.listarAdministradores);
  // Organizaciones
  app.post('/api/organizaciones/crear', usuariosCTLR.crearOrganizacion);
  app.post('/api/organizaciones/aprobar', auth.administrador, usuariosCTLR.aprobarOrganizacion);
  app.post('/api/organizaciones/modificar', auth.administrador, usuariosCTLR.modificarOrganizacion);
  app.get('/api/organizaciones/ver/id=:id', usuariosCTLR.verOrganizacion);
  app.get('/api/organizaciones/listarAprobadas', usuariosCTLR.listarOrganizacionesAprobadas);
  app.get('/api/organizaciones/listar', auth.administrador, usuariosCTLR.listarOrganizaciones);
  app.get('/api/organizaciones/listar/aprobacion=:aprobacion', auth.administrador, usuariosCTLR.listarOrganizacionesPorAprobacion);
  // Donantes
  app.post('/api/donantes/crear', usuariosCTLR.crearDonante);
  app.post('/api/donantes/validar', auth.administrador, usuariosCTLR.validarDonante);
  app.post('/api/donantes/modificar', auth.administrador, usuariosCTLR.modificarDonante);
  app.get('/api/donantes/ver/id=:id', auth.administrador, usuariosCTLR.verDonantes);
  app.get('/api/donantes/listarValidos', usuariosCTLR.listarDonantesValidos);
  app.get('/api/donantes/listar', auth.administrador, usuariosCTLR.listarDonantes);
  app.get('/api/donantes/listar/validacion=:validacion', auth.administrador, usuariosCTLR.listarDonantesPorValidacion);

  // Eventos
  app.post('/api/eventos/crear', auth.administrador, eventosCTLR.crear);
  app.post('/api/eventos/estado', eventosCTLR.cambiarEstado);
  app.post('/api/eventos/modificar', auth.administrador, eventosCTLR.modificar);
  app.get('/api/eventos/ver/id=:id', eventosCTLR.ver);
  app.get('/api/eventos/listarValidos', eventosCTLR.listarEventosValidos);
  app.get('/api/eventos/listar', eventosCTLR.listar);
  app.get('/api/eventos/listar/estado=:estado', auth.administrador, eventosCTLR.listarEventosPorEstado);
  
  // Postulaciones
  app.post('/api/postulaciones/crear', postulacionesCTLR.crear);
  app.get('/api/postulaciones/ver/id=:id', auth.administrador, postulacionesCTLR.ver);
  app.get('/api/postulaciones/listar', auth.administrador, postulacionesCTLR.listar);
  app.get('/api/postulaciones/listar/iniciativa=:iniciativa', auth.administrador, postulacionesCTLR.listarPorIniciativa);
  app.get('/api/postulaciones/listar/donante=:donante', auth.administrador,  postulacionesCTLR.listarPorDonante);
  app.get('/api/postulaciones/listar/fecha=:fecha', auth.administrador,  postulacionesCTLR.listarPorFecha);
  app.get('/api/postulaciones/listar/inicio=:inicio/fin=:fin', auth.administrador, postulacionesCTLR.listarEntreFechas);
  
  // Iniciativas
  app.post('/api/iniciativas/crear', auth.administrador, iniciativasCTLR.crear);  
  app.post('/api/iniciativas/modificar', auth.administrador, iniciativasCTLR.modificar);
  app.post('/api/iniciativas/aprobar', auth.administrador, iniciativasCTLR.aprobar);
  app.get('/api/iniciativas/ver/iniciativa/:iniciativa', iniciativasCTLR.ver); // Para uso del público
  app.get('/api/iniciativas/listarAprobadas', iniciativasCTLR.listarAprobadas);
  app.get('/api/iniciativas/listar', auth.administrador, iniciativasCTLR.listar); // Solo Admin
  app.get('/api/iniciativas/listar/evento/:evento', iniciativasCTLR.listarPorEvento); // Para uso del publico
  app.get('/api/iniciativas/listar/organizacion/:organizacion', auth.organizacion, iniciativasCTLR.listarPorOrganizacion); // Solo Organizaciones
  app.get('/api/iniciativas/listar/aprobacion/:aprobacion', auth.administrador, iniciativasCTLR.listarPorAprobacion); // Solo Admin

  // MercadoPago
  app.post('/api/donaciones/crear', mercadopagoAPI.createPreference);
  app.post('/api/donaciones/suscripcion/crearPlan', mercadopagoAPI.createPlan);
  app.post('/api/donaciones/suscripcion/suscribir', mercadopagoAPI.suscribeToPlan);

  // Mediciones
  app.post('/api/medicion/suscripcion', medicionesCTLR.crear);

  // Email
  app.post('/api/email/enviar', auth.administrador, emailCTLR.enviarMail);
}

