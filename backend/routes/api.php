<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ArticuloController;
use App\Http\Controllers\ComentarioController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\EmpresaController;
use App\Http\Controllers\SedeController;
use App\Http\Controllers\CandidaturaController;
use App\Http\Controllers\AlumnoController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

/*Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});*/


Route::post('login', [AuthController::class, 'authenticate']);

Route::get('dni/{dni}', [UserController::class, 'showDni']);





Route::group(['middleware' => ['jwt.verify']], function() {
    //Todo lo que este dentro de este grupo requiere verificación de usuario.
    Route::get('usuarios/{rol}', [UserController::class, 'index']);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('user', [AuthController::class, 'getUser']);
    Route::get('miperfil', [UserController::class, 'miPerfil']);
    Route::get('empresas', [EmpresaController::class, 'index']);
    Route::get('usuario/{id}', [UserController::class, 'show']);

    Route::put('usuario/{id}', [UserController::class, 'update']);

    
    Route::post('register', [AuthController::class, 'register']);


    Route::get('empresa/{id}', [EmpresaController::class, 'show']);


    Route::put('empresa/{id}', [EmpresaController::class, 'update']);

    Route::get('sede/{id}', [SedeController::class, 'show']);

    Route::put('sede/{id}', [SedeController::class, 'update']);

    Route::post('nuevaEmpresa', [EmpresaController::class, 'store']);


    Route::post('nuevaSede', [SedeController::class, 'store']);

    Route::get('candidaturas', [CandidaturaController::class, 'index']);

    Route::get('candidatura/{id}', [CandidaturaController::class, 'show']);

    Route::put('candidatura/{id}', [CandidaturaController::class, 'update']);

    Route::post('candidatura', [CandidaturaController::class, 'store']);

    Route::delete('usuario/{id}', [UserController::class, 'destroy']);

    Route::delete('empresa/{id}', [EmpresaController::class, 'destroy']);

    Route::delete('sede/{id}', [SedeController::class, 'destroy']);

    Route::delete('candidatura/{id}', [CandidaturaController::class, 'destroy']);

    Route::post('/subir-curriculum/{id}', [UserController::class, 'subirCurriculum']);

    Route::get('/ver-curriculum/{id}', [UserController::class, 'VerCurriculum']);

    Route::get('/aceptada/{id}', [CandidaturaController::class, 'candidaturaAceptada']);

    // Alta de un artículo
    Route::post('articulos', [ArticuloController::class, 'store']);
    // Modificación de un artículo
    
    // Borrado de un artículo
    Route::delete('articulos/{id}', [ArticuloController::class, 'destroy']);
    // Allta de un comentario
    Route::post('comentarios', [ComentarioController::class, 'store']);
    // Actualización de un comentario
    Route::put('comentarios/{id}', [ComentarioController::class, 'update']);
    // Borrado de un comentario
    Route::delete('comentarios/{id}', [ComentarioController::class, 'destroy']);
});
