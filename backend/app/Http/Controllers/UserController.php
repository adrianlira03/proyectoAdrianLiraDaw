<?php

namespace App\Http\Controllers;

use JWTAuth;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use App\Models\User;


class UserController extends Controller
{
    protected $user;
    public function __construct(Request $request)
    {
        $token = $request->header('Authorization');
        if ($token != '') {
            $this->user = JWTAuth::parseToken()->authenticate();
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     * 
     */

    public function index($rol)
    {

        if ($this->user->rol == 1 && $rol == 1) {

            $error = "No tienes permiso para ver los alumnos";
            return response()->json([
                'error' => $error
            ], Response::HTTP_NOT_ACCEPTABLE);
        } else {

            $usuarios = User::where('rol', $rol)->get();

            return response()->json([
                'data' => $usuarios
            ], Response::HTTP_OK);
        }
    }

    public function show($id)
    {

        $usuario = User::find($id);
        if ($this->user->rol == 2) {
            if (!$usuario) {
                return response()->json([
                    'mensaje' => 'Usuario no encontrado.'
                ], 404);
            }


            return response()->json([
                'data' => $usuario
            ], Response::HTTP_OK);
        } else {

            $error = "No tienes permiso para ver los usuarios";
            return response()->json([
                'error' => $error
            ], Response::HTTP_NOT_ACCEPTABLE);
        }
    }

    public function showDni($dni)
    {

        $usuario = User::where('dni', $dni)->first();

        if (!$usuario) {
            return response()->json([
                'mensaje' => 'Usuario no encontrado.'
            ], 404);
        } else {

            return response()->json([
                'data' => $usuario
            ], Response::HTTP_OK);
        }
    }


    public function miPerfil()
    {

        $id = $this->user->id;

        $usuario = User::find($id);

        if (!$usuario) {
            return response()->json([
                'mensaje' => 'Usuario no encontrado.'
            ], 404);
        }

        return response()->json([
            'data' => $usuario
        ], Response::HTTP_OK);
    }





    public function update(Request $request, $id)
    {

        $data = $request->only('nombre', 'apellidos', 'telefono', 'correo', 'dni');
        $validator = Validator::make($data, [
            'nombre' => 'required|string',
            'apellidos' => 'required|string',
            'telefono' => 'required|int',
            'correo' => 'required|string',
            'dni' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->messages()], 400);
        }

        $usuario = User::find($id);

        if (!$usuario) {
            return response()->json([
                'mensaje' => 'Usuario no encontrado.'
            ], 404);
        }


        if ($usuario->id != $this->user->id && $this->user->rol != 2) {
            return response()->json([
                'mensaje' => 'No tienes permiso para actualizar este usuario'
            ], 404);
        } else {
            $usuario->update([
                'nombre' => $request->nombre,
                'apellidos' => $request->apellidos,
                'telefono' => $request->telefono,
                'correo' => $request->correo,
                'dni' => $request->dni
            ]);

            return response()->json([
                'mensaje' => 'Usuario actualizado correctamente',
                'data' => $usuario
            ], Response::HTTP_OK);
        }
    }


    public function destroy($id)
    {
        $usuario = User::find($id);

        if (!$usuario) {
            return response()->json([
                'mensaje' => 'Usuario no encontrado.'
            ], 404);
        } elseif ($this->user->rol == 1) {
            return response()->json([
                'mensaje' => 'No tienes permiso para borrar al usuario.'
            ], 404);
        } else {
            $usuario->delete();
            return response()->json([
                'mensaje' => 'Usuario borrado correctamente'
            ], Response::HTTP_OK);
        }
    }


    public function subirCurriculum(Request $request, $id)
    {

        $request->validate([
            'curriculum' => 'required|mimes:pdf|max:2048',
        ]);


        $archivo = $request->file('curriculum');

        $rutaArchivo = $archivo->store('public/curriculums');


        if ($this->user->rol == 1) {


            $userId = $this->user->id;
        } else {

            $userId = $id;
        }

        $usuario = User::find($userId);

        if (!$usuario) {
            return response()->json(['message' => 'No se encontró el usuario correspondiente'], 404);
        }

        $usuario->curriculum = $rutaArchivo;
        $usuario->save();

        return response()->json(['message' => 'Currículum subido correctamente'], 200);
    }



    public function verCurriculum($id)
    {
        if ($this->user->rol == 1) {


            $userId = $this->user->id;
        } else {

            $userId = $id;
        }

        $usuario = User::find($userId);

        if (!$usuario || !$usuario->curriculum) {
            return response()->json(['message' => 'No se encontró el currículum'], 404);
        }

        $rutaArchivo = storage_path('app/' . $usuario->curriculum);

        if (!file_exists($rutaArchivo)) {
            return response()->json(['message' => 'No se encontró el currículum'], 404);
        }

        $nombreArchivo = basename($rutaArchivo);

        return response()->file($rutaArchivo, ['Content-Disposition' => 'inline; filename="' . $nombreArchivo . '"']);
    }
}
