<?php

namespace App\Http\Controllers;

use JWTAuth;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use App\Models\Sede;


class SedeController extends Controller
{
    protected $user;
    public function __construct(Request $request)
    {
        $token = $request->header('Authorization');
        if ($token != '') {
            $this->user = JWTAuth::parseToken()->authenticate();
        }
    }


    public function show($id)
    {

        $sede = Sede::find($id);
        if ($this->user->rol == 2) {
            if (!$sede) {
                return response()->json([
                    'mensaje' => 'Sede no encontrada.'
                ], 404);
            }


            return response()->json([
                'data' => $sede
            ], Response::HTTP_OK);
        } else {

            $error = "No tienes permiso para ver las sedes";
            return response()->json([
                'error' => $error
            ], Response::HTTP_NOT_ACCEPTABLE);
        }
    }


    public function update(Request $request, $id)
    {

        $data = $request->only('direccion', 'telefono');
        $validator = Validator::make($data, [
            'direccion' => 'required|string',
            'telefono' => 'required|int',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->messages()], 400);
        }

        $sede = Sede::find($id);

        if (!$sede) {
            return response()->json([
                'mensaje' => 'Sede no encontrada.'
            ], 404);
        } elseif ($this->user->rol == 1) {

            return response()->json([
                'mensaje' => 'No tienes permiso para actualizarla'
            ], 500);
        } else {
            $sede->update([
                'direccion' => $request->direccion,
                'telefono' => $request->telefono,
            ]);

            return response()->json([
                'mensaje' => 'Sede actualizada correctamente',
                'data' => $sede
            ], Response::HTTP_OK);
        }
    }


    public function store(Request $request)
    {
        $data = $request->only('direccion', 'telefono', 'empresa_id');
        $validator = Validator::make($data, [
            'direccion' => 'required|string',
            'telefono' => 'required|int',
            'empresa_id' => 'required|int'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->messages()], 400);
        }


        if ($this->user->rol == 1) {

            return response()->json([
                'mensaje' => 'No tienes permiso para crear una sede'
            ], 404);
        }

        $sede = Sede::create([
            'direccion' => $data["direccion"],
            'telefono' => $data["telefono"],
            'empresa_id' => $data["empresa_id"]
        ]);

        return response()->json([
            'mensaje' => 'Sede creada',
            'data' => $sede
        ], Response::HTTP_OK);
    }

    public function destroy($id)
    {
        $sede = Sede::find($id);

        if (!$sede) {
            return response()->json([
                'mensaje' => 'Sede no encontrada.'
            ], 404);
        } elseif ($this->user->rol == 1) {
            return response()->json([
                'mensaje' => 'No tienes permiso para borrar la sede.'
            ], 404);
        } else {
            $sede->delete();
            return response()->json([
                'mensaje' => 'Sede borrada correctamente'
            ], Response::HTTP_OK);
        }
    }
}
