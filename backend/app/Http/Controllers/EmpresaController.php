<?php

namespace App\Http\Controllers;

use JWTAuth;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

use App\Models\Empresa;

class EmpresaController extends Controller
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
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {

        $empresa = Empresa::with('sedes')->get();

        return response()->json([
            'data' => $empresa
        ], Response::HTTP_OK);
    }



    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Categoria  $categoria
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        if ($this->user->rol == 2) {

            $empresa = Empresa::with('sedes')->find($id);

            return response()->json([
                'data' => $empresa
            ], Response::HTTP_OK);
        } else {

            return response()->json([
                'mensaje' => 'No tienes permiso para ver esta empresa'
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Articulo  $articulo
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {

        $data = $request->only('nombre', 'descripcion');
        $validator = Validator::make($data, [
            'nombre' => 'required|string|max:150',
            'descripcion' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->messages()], 400);
        }

        $empresa = Empresa::find($id);

        if (!$empresa) {
            return response()->json([
                'mensaje' => 'Empresa no encontrada.'
            ], 404);
        } elseif ($this->user->rol == 1) {

            return response()->json([
                'mensaje' => 'No tienes permiso para actualizarla'
            ], 500);
        } else {
            $empresa->update([
                'nombre' => $request->nombre,
                'descripcion' => $request->descripcion,
            ]);

            return response()->json([
                'mensaje' => 'Empresa actualizada correctamente',
                'data' => $empresa
            ], Response::HTTP_OK);
        }
    }



    public function store(Request $request)
    {
        $data = $request->only('nombre', 'descripcion');
        $validator = Validator::make($data, [
            'nombre' => 'required|string',
            'descripcion' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->messages()], 400);
        }


        if ($this->user->rol == 1) {

            return response()->json([
                'mensaje' => 'No tienes permiso para crear una empresa'
            ], 404);
        }

        $empresa = Empresa::create([
            'nombre' => $data["nombre"],
            'descripcion' => $data["descripcion"]
        ]);

        return response()->json([
            'mensaje' => 'Empresa creada',
            'data' => $empresa
        ], Response::HTTP_OK);
    }



    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Articulo $articulo
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $empresa = Empresa::find($id);

        if (!$empresa) {
            return response()->json([
                'mensaje' => 'Empresa no encontrada.'
            ], 404);
        } elseif ($this->user->rol == 1) {
            return response()->json([
                'mensaje' => 'No tienes permiso para borrar a la empresa.'
            ], 404);
        } else {
            $empresa->delete();
            return response()->json([
                'mensaje' => 'Empresa borrada correctamente'
            ], Response::HTTP_OK);
        }
    }
}
