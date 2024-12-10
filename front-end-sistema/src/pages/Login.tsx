import '../styles/App.css'
import Background from '../assets/bg-img.svg'

const Login = () => {
  return (
    <>
      <aside className='background'>
        <img src={Background} alt='imagen del background' />
      </aside>
      <main>
        <aside>
          Sistema de mantenimiento
        </aside>
        <section>
          <h1>Iniciar Sesion</h1>
          <p>Ingresa tu usuario</p>
          <form action="">
            <input type="text" name="user" id="user" />
            <button>Continuar</button>
          </form>
          <div className="recommend">
            <div className="point"></div>
            <p>El usuario debe existir para continuar</p>
          </div>
        </section>
      </main>
    </>
  )
}

export default Login
