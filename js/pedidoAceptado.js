
function EvaluarIngresoDeSesion()
{
  if(!sessionStorage.getItem('idUsuario'))
  {
    window.location.href = "../index.html";
  }
}