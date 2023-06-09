<?php

namespace App\Http\Controllers;

use JWTAuth;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

use App\Models\Candidatura;

class CandidaturaController extends Controller
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

        if ($this->user->rol == 1) {

            $candidaturas = Candidatura::with('user', 'empresa')->where('user_id', $this->user->id)->get();
        } else {

            $candidaturas = Candidatura::with('user', 'empresa')->get();
        }

        return response()->json([
            'data' => $candidaturas
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

        $candidatura = Candidatura::with('user', 'empresa')->find($id);
        if ($this->user->rol == 2) {
            if (!$candidatura) {
                return response()->json([
                    'mensaje' => 'Candidatura no encontrada.'
                ], 404);
            }


            return response()->json([
                'data' => $candidatura
            ], Response::HTTP_OK);
        } else {

            $error = "No tienes permiso para ver las candidaturas";
            return response()->json([
                'error' => $error
            ], Response::HTTP_NOT_ACCEPTABLE);
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

        $data = $request->only('estado');
        $validator = Validator::make($data, [
            'estado' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->messages()], 400);
        }

        $candidatura = Candidatura::find($id);

        if (!$candidatura) {
            return response()->json([
                'mensaje' => 'Empresa no encontrada.'
            ], 404);
        } elseif ($this->user->rol == 1) {

            return response()->json([
                'mensaje' => 'No tienes permiso para actualizarla'
            ], 500);
        } else {
            $candidatura->update([
                'estado' => $request->estado
            ]);

            return response()->json([
                'mensaje' => 'Candidatura actualizada correctamente',
                'data' => $candidatura
            ], Response::HTTP_OK);
        }
    }



    public function store(Request $request)
    {

        $data = $request->only('user_id', 'empresa_id', 'estado');
        $validator = Validator::make($data, [
            'user_id' => 'required|int',
            'empresa_id' => 'required|int',
            'estado' => 'required|string'
        ]);


        if ($validator->fails()) {
            return response()->json(['error' => $validator->messages()], 400);
        }


        if ($this->user->rol == 1) {

            return response()->json([
                'mensaje' => 'No tienes permiso para crear una candidatura'
            ], 404);
        }

        $candidatura = Candidatura::create([
            'user_id' => $data["user_id"],
            'empresa_id' => $data["empresa_id"],
            'estado' => $data["estado"]
        ]);


        return response()->json([
            'mensaje' => 'Candidatura creada',
            'data' => $candidatura
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
        $candidatura = Candidatura::find($id);

        if (!$candidatura) {
            return response()->json([
                'mensaje' => 'Candidatura no encontrada.'
            ], 404);
        } elseif ($this->user->rol == 1) {
            return response()->json([
                'mensaje' => 'No tienes permiso para borrar la candidatura.'
            ], 404);
        } else {
            $candidatura->delete();
            return response()->json([
                'mensaje' => 'Candidatura borrada correctamente'
            ], Response::HTTP_OK);
        }
    }

    public function candidaturaAceptada($id)
    {
        $candidatura = Candidatura::where('user_id', $id)->where('estado', 'aceptado')->get();


        return response()->json([
            'data' => $candidatura
        ], Response::HTTP_OK);
    }
}
