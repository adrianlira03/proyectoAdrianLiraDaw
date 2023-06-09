<?php

namespace App\Http\Controllers;

use JWTAuth;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use PHPOpenSourceSaver\JWTAuth\Exceptions\JWTException;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;




class AuthController extends Controller
{

    protected $user;
    public function __construct(Request $request)
    {
        $token = $request->header('Authorization');
        if ($token != '') {
            $this->user = JWTAuth::parseToken()->authenticate();
        }
    }

    // Función que utilizaremos para registrar al usuario
    public function register(Request $request)
    {

        if ($this->user->rol == 2) {
            // Indicamos que solo queremos recibir nombre, apellidos, edad,email y password de la request
            $data = $request->only('id', 'nombre', 'apellidos', 'rol', 'password', 'telefono', 'correo', 'dni');

            //Realizamos las validaciones
            $validator = Validator::make($data, [
                'nombre' => 'required|string',
                'apellidos' => 'required|string',
                'password' => 'required|string',
                'telefono' => 'required|int',
                'correo' => 'required|string',
                'dni' => 'required|string'

            ]);

            // Devolvemos un error si fallan las validaciones
            if ($validator->fails()) {
                return response()->json(['error' => $validator->messages()], 400);
            }

            // Creamos el nuevo usuario si todo es correcto
            $user = User::create([
                'nombre' => $request->nombre,
                'apellidos' => $request->apellidos,
                'rol' => $request->rol,
                'password' => bcrypt($request->password),
                'telefono' => $request->telefono,
                'correo' => $request->correo,
                'dni' => $request->dni


            ]);

            // Devolvemos la respuesta con los datos del usuario
            return response()->json([
                'exito' => true,
                'mensaje' => 'Usuario creado',
                'usuario' => $user
            ], Response::HTTP_OK);
        } else {

            return response()->json([
                'mensaje' => 'No tienes permiso para crear este usuario'
            ], 500);
        }
    }

    // Funcion que utilizaremos para hacer login
    public function authenticate(Request $request)
    {
        // Indicamos que solo queremos recibir email y password de la request
        $credentials = $request->only('dni', 'password');


        // Validaciones
        $validator = Validator::make($credentials, [
            'dni' => 'required|string',
            'password' => 'required|string'
        ]);

        // Devolvemos un error de validación en caso de fallo en las verificaciones
        if ($validator->fails()) {
            return response()->json(['error' => $validator->messages()], 400);
        }



        // Intentamos hacer login
        try {
            if (!$token = JWTAuth::attempt($credentials)) {
                // Credenciales incorrectas.
                return response()->json([
                    'exito' => false,
                    'mensaje' => 'Login falló: credenciales incorrectas',
                    'm' => $validator->fails(),

                ], 401);
            }
        } catch (JWTException $e) {
            // Error al intentar crear el token
            return response()->json([
                'exito' => false,
                'mensaje' => 'No se ha podido crear el token',
            ], 500);
        }
        // Devolvemos el token
        return response()->json([
            'exito' => true,
            'token' => $token
        ]);
    }

    // Función que utilizaremos para eliminar el token y desconectar al usuario
    public function logout(Request $request)
    {
        try {
            // Si el token es válido eliminamos el token desconectando al usuario.
            JWTAuth::invalidate(JWTAuth::getToken());
            return response()->json([
                'exito' => true,
                'mensaje' => 'Usuario desconectado'
            ]);
        } catch (JWTException $exception) {
            // Error al intentar invalidar el token
            return response()->json([
                'exito' => false,
                'mensaje' => 'Error al intentar desconectar al usuario'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function getUser(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();

        if (!$user) {
            return response()->json([
                'exito' => false,
                'mensaje' => 'Token invalido / token expirado',
            ], 401);
        }

        return response()->json([
            'exito' => true,
            'usuario' => $user
        ]);
    }
}
