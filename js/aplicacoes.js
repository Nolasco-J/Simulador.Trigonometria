"use strict";

var App = App || {};

//Apresenta uma aplicação na física
App.aplicacoes = (function ()
{  
  var primeiraTela; 
  var objCanvas;
  var objImagens;
  var mensagem;

  //constantes
  var X_ZERO;
  var Y_ZERO;
  var BASE;

  //Constantes numéricas - ângulos principais
  var CENTO_OITENTA = Math.PI;
  var NOVENTA = CENTO_OITENTA/2;
  var DUZENTOS_SETENTA = CENTO_OITENTA + NOVENTA;
  
  $(document).ready( function()
  {
    //instância de singletonCanvas
    objCanvas = App.singletons.singletonCanvas.getInstancia();
    objImagens = App.singletons.singletonImagens.getInstancia();

    //constantes para serem usadas pelas funções
    X_ZERO = objCanvas.canvasWidth/2;
    Y_ZERO = objCanvas.canvasHeight/2 + objCanvas.canvasHeight/5;
    BASE = objCanvas.canvasWidth/2.5;
  })

  //Função Principal
  var inicio = function ()
  {
    App.teoria.pararAnimacao();//se houver algo rodando, pára

    //quando início é executado, a primeira tela do módulo é renderizada
    //aqui, indica que é a primeira tela
    primeiraTela = true;

    //garante que o evento KeyDown vai sobrescrever outros keydowns não
    //utilizados aqui!
    ajustaKeyDown();

    //ajusta as configurações de evento mouse down
    ajustaMouseDown();

    //limpeza inicial da tela, para reconstrução
    App.strategiesTela.limpaTela.executa([
      "1",
      0,
      0,
      objCanvas.canvasWidth,
      objCanvas.canvasHeight
    ]);

    App.strategiesTela.limpaTela.executa([
      "2",
      0,
      0,
      objCanvas.canvasWidth,
      objCanvas.canvasHeight
    ]);

    /*
    carrega imagem de fundo
    */
    App.strategiesTela.construtorImagemFundo.executa([
      "2",
      "frame",
      5,
      5,
      objCanvas.canvasWidth-5,
      objCanvas.canvasHeight - 5
    ]);

     //Base do plano inclinado
     App.strategiesTela.construtorReta.executa([
      "2",
      (X_ZERO)-(BASE),
      Y_ZERO,
      (X_ZERO),
      Y_ZERO,
      "#FFF",
      4
    ]);

    // Ângulo inicial: 30°
    var angRadInicial = (210*CENTO_OITENTA)/180;

    //Preenche o ângulo com um segmento de arco, para indicar a área que ele representa    
    // Desenhando
    App.strategiesTela.construtorArco.executa([
        "1",
        X_ZERO,
        Y_ZERO,
        (BASE/18)*3,
        angRadInicial,
        CENTO_OITENTA,
        "#FFF",
        2
    ]);

    // Coordenadas do ponto inicial para desenhar o plano inclinado
    var ponto = App.strategiesCalculadora.ponto.calcula([angRadInicial, X_ZERO, Y_ZERO, BASE]);

    // Plano inclidado móvel - primeira posição: 30°
    App.strategiesTela.construtorReta.executa([
      "1",
      ponto[0],
      ponto[1],
      X_ZERO,
      Y_ZERO,
      "#FFF",
      4
    ]);

    // Coordenadas dos pontos vértices do quadrilátero (corpo sobre o plano inclinado)
    var pontoA = App.strategiesCalculadora.ponto.calcula([angRadInicial, X_ZERO, Y_ZERO, (BASE/18)*9]);
    var pontoB = App.strategiesCalculadora.ponto.calcula([angRadInicial, X_ZERO, Y_ZERO, (BASE/18)*12]);
    var pontoC = App.strategiesCalculadora.ponto.calcula([angRadInicial + NOVENTA, pontoB[0], pontoB[1], (BASE/18)*3]);
    var pontoD = App.strategiesCalculadora.ponto.calcula([angRadInicial + NOVENTA, pontoA[0], pontoA[1], (BASE/18)*3]);

    App.strategiesTela.construtorReta.executa([
      "1",
      pontoA[0],
      pontoA[1],
      pontoB[0],
      pontoB[1],
      "#F00",
      4
    ]);

    App.strategiesTela.construtorReta.executa([
      "1",
      pontoB[0],
      pontoB[1],
      pontoC[0],
      pontoC[1],
      "#F00",
      4
    ]);

    App.strategiesTela.construtorReta.executa([
      "1",
      pontoC[0],
      pontoC[1],
      pontoD[0],
      pontoD[1],
      "#F00",
      4
    ]);

    App.strategiesTela.construtorReta.executa([
      "1",
      pontoA[0],
      pontoA[1],
      pontoD[0],
      pontoD[1],
      "#F00",
      4
    ]); 


    // Ângulo entre Py e P
    var angRetaP = CENTO_OITENTA-(DUZENTOS_SETENTA-angRadInicial)


    // Coornedadas do ponto central do quadrilátero, 
    // que será início para as retas N, P, Px e Py
    var NovoXZero = (pontoA[0]+pontoC[0])/2
    var NovoYZero = (pontoA[1]+pontoC[1])/2

    // Coordenadas dos pontos para:
    //  a reta que representa o sentido da força normal N
    //  a reta que representa a força peso (gravidade) P
    //  a reta Px 
    //  a reta Py    
    var pontoE = App.strategiesCalculadora.ponto.calcula([angRadInicial + NOVENTA, NovoXZero, NovoYZero, (BASE/18)*4]);
    var pontoF = App.strategiesCalculadora.ponto.calcula([angRadInicial - NOVENTA, NovoXZero, NovoYZero, (BASE/18)*4]);
    var pontoG = App.strategiesCalculadora.ponto.calcula([angRadInicial - angRetaP, NovoXZero, NovoYZero, (BASE/18)*4]);
    var pontoG = App.strategiesCalculadora.ponto.calcula([angRadInicial - angRetaP, NovoXZero, NovoYZero, (BASE/18)*4]);
    var pontoH = App.strategiesCalculadora.ponto.calcula([angRadInicial - CENTO_OITENTA, NovoXZero, NovoYZero, (BASE/18)*4]);

    // Reta - Força N
    desenhaReta(NovoXZero, NovoYZero, pontoE[0], pontoE[1], "#0F0", 4);

    // Reta - Px
    desenhaReta(NovoXZero, NovoYZero, pontoH[0], pontoH[1], "#CCC", 4);

    // Reta - Py
    desenhaReta(NovoXZero, NovoYZero, pontoF[0], pontoF[1], "#00F", 4);

    // Reta - P
    desenhaReta(NovoXZero, NovoYZero, pontoG[0], pontoG[1], "#F0F", 4);

  }

  //Recebe as coordenadas para calcular o novo ponto
  //para a reta pontilhada que cruza a tangente, as coordenadas das demais retas
  //pontilhadas, da reta vermelha
  //Redesenha o ciclo completamente
  //----------------------------------------------------------------------------
  // ReDesenha
  //----------------------------------------------------------------------------
  var reDesenha = function (pontoX, pontoY, angRad)
  {
    //limpeza inicial da tela, para reconstrução
    //somente o canvas superior
    App.strategiesTela.limpaTela.executa([
      "1",
      0,
      0,
      objCanvas.canvasWidth,
      objCanvas.canvasHeight,
    ]);


    if(angRad>CENTO_OITENTA)
    {
      //Preenche o ângulo com um segmento de arco, para indicar a área que ele representa    
      // Desenhando
      App.strategiesTela.construtorArco.executa([
          "1",
          X_ZERO,
          Y_ZERO,
          (BASE/18)*3,
          angRad,
          CENTO_OITENTA,
          "#FFF",
          3
      ]);        
    }

    //
    desenhaReta(X_ZERO, Y_ZERO, pontoX, pontoY, "#FFF", 4);

    // Coordenadas do ponto inicial para desenhar a base do corpo sobre o plano
    var pontoA = App.strategiesCalculadora.ponto.calcula([angRad, X_ZERO, Y_ZERO, (BASE/18)*9]);
    var pontoB = App.strategiesCalculadora.ponto.calcula([angRad, X_ZERO, Y_ZERO, (BASE/18)*12]);
    var pontoC = App.strategiesCalculadora.ponto.calcula([angRad + NOVENTA, pontoB[0], pontoB[1], (BASE/18)*3]);
    var pontoD = App.strategiesCalculadora.ponto.calcula([angRad + NOVENTA, pontoA[0], pontoA[1], (BASE/18)*3]);

    desenhaReta(pontoA[0], pontoA[1], pontoB[0], pontoB[1], "#F00", 4);
    desenhaReta(pontoB[0], pontoB[1], pontoC[0], pontoC[1], "#F00", 4);
    desenhaReta(pontoC[0], pontoC[1], pontoD[0], pontoD[1], "#F00", 4);
    desenhaReta(pontoA[0], pontoA[1], pontoD[0], pontoD[1], "#F00", 4);


    // Ângulo entre Py e P
    var angRetaP = CENTO_OITENTA-(DUZENTOS_SETENTA-angRad)


    // Coornedadas do ponto central do quadrilátero, 
    // que será início para as retas N, P, Px e Py
    var NovoXZero = (pontoA[0]+pontoC[0])/2
    var NovoYZero = (pontoA[1]+pontoC[1])/2

    // Coordenadas dos pontos para:
    //  a reta que representa o sentido da força normal N
    //  a reta que representa a força peso (gravidade) P
    //  a reta Px 
    //  a reta Py    
    var pontoE = App.strategiesCalculadora.ponto.calcula([angRad + NOVENTA, NovoXZero, NovoYZero, (BASE/18)*4]);
    var pontoF = App.strategiesCalculadora.ponto.calcula([angRad - NOVENTA, NovoXZero, NovoYZero, (BASE/18)*4]);
    var pontoG = App.strategiesCalculadora.ponto.calcula([angRad - angRetaP, NovoXZero, NovoYZero, (BASE/18)*4]);
    var pontoG = App.strategiesCalculadora.ponto.calcula([angRad - angRetaP, NovoXZero, NovoYZero, (BASE/18)*4]);
    var pontoH = App.strategiesCalculadora.ponto.calcula([angRad - CENTO_OITENTA, NovoXZero, NovoYZero, (BASE/18)*4]);

    // Reta - Força N
    desenhaReta(NovoXZero, NovoYZero, pontoE[0], pontoE[1], "#0F0", 4);

    // Reta - Px
    desenhaReta(NovoXZero, NovoYZero, pontoH[0], pontoH[1], "#FFF", 4);

    // Reta - Py
    desenhaReta(NovoXZero, NovoYZero, pontoF[0], pontoF[1], "#00F", 4);

    // Reta - P
    desenhaReta(NovoXZero, NovoYZero, pontoG[0], pontoG[1], "#F0F", 4);

  }// Fim Função Redesenha

  // Função que chama o contrutor reta, passando os parâmetros recebidos
  var desenhaReta = function (pontoXo, pontoYo, pontoX, pontoY, cor, espessura){

    App.strategiesTela.construtorReta.executa([
      "1",
      pontoXo,
      pontoYo,
      pontoX,
      pontoY,
      cor,
      espessura
    ]);
  }

  // Fora da função, pois deve guardar o valor final dentro da função
  //var angFinal = 150° --- corrigido, equivale a 30° com o espelhamento da imagem, que é o que queremos;
  // Limitando o ângulo entre 180° e 100° - corrigindo: 0° a 80°
  var angFinal;
  /*
    Detecta botões do teclado pressionados
  */
  var ajustaKeyDown = function ()
  {
    //desvincula os eventos existentes (todos os keydowns)
    objCanvas.doc.unbind("keydown");

    objCanvas.doc.on("keydown.planoinclinado", function (evt)
    {
      var angRad; // para uso interno na função

      // garante que o ângulo sempre comece em ZERO quando entrar no módulo
      if(primeiraTela)
      {
        angFinal = 210;
        primeiraTela = false;
      }

      switch (evt.keyCode) //Testa o código do evento do teclado
      {
        //
        /*
        código 40 -> seta para baixo --------------------------------------------
        Faz a reta andar no sentido antihorário, fazendo o ângulo decrescer
        */
        case 40:
          if(angFinal<=180)
            angFinal=180;
          else
            angFinal--;

          if(angFinal==0)
            angRad = 0;

          else
            angRad = (angFinal*CENTO_OITENTA)/180;// valor corrigido, em Rad

          break;

        //
        /*
        seta para cima ----------------------------------------------
        */
        case 38:
          if(angFinal>=230)
            angFinal=230;
          else
            angFinal++;

          angRad = (angFinal*CENTO_OITENTA)/180;

          break;

        /*
        Para qualquer outra tecla, encerra a execução dessa função
        */
        default:
          return;
      }
      //chama função para calcular o ponto da reta vermelha,
      // para redesenhar e escreescrever
      var ponto = App.strategiesCalculadora.ponto.calcula([angRad, X_ZERO, Y_ZERO, BASE]);
      reDesenha(ponto[0], ponto[1], angRad);
      //reEscreve(360-angFinal);**********************************************************************************
    });
  } //Fim ajustaKeydown



  /*
    Detecta cliques
  */
  var ajustaMouseDown = function ()
  {
    // desvincula os demais eventos, para que não execute na tela errada.
    objCanvas.canvas1.unbind();   
  }

  /*
    Retorno: função inicio -> ponto de acesso ao módulo
  */
  return {
    inicio: inicio //única função visível externamente ao módulo
  }
})();
