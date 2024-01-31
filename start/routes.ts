import Route from '@ioc:Adonis/Core/Route'
import UsersController from 'App/Controllers/Http/UsersController'

Route.post('/users/login', async ({ auth, request, response }) => {
  const email = request.input('email')
  const password = request.input('password')

  try {
    const token = await auth.use('api').attempt(email, password)
    return token
  } catch {
    return response.unauthorized('Email ou senha inválidos')
  }
}).prefix('api')

Route.post('/firstUser', 'UsersController.firstUser').prefix('/api')
Route.delete('/deleteAll', 'UsersController.deleteAll').prefix('/api')

Route.group(() => {
  Route.get('/users/dashboard', async ({ auth }) => {
    try {
      await auth.authenticate()
      console.log(auth.user)
      return 'Olá, você está autenticado'
    } catch (error) {
      return `Erro de autenticação ${error.message}`
    }
  })

  Route.resource('/users', 'UsersController').apiOnly()
})
  .prefix('/api')
  .middleware('auth')
