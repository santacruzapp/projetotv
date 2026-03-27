AJUSTES FEITOS NO PROJETO

1) app.js ajustado para forcar atualizacao do video usando a versao no config.json
2) config.json atualizado para apontar para um MP4 mais compativel com TV
3) video convertido para um formato mais compativel:
   - H.264 Constrained Baseline
   - 1280x720
   - yuv420p
   - AAC
   - faststart

OBSERVACAO IMPORTANTE
O arquivo videos/tv.mp4 que estava no projeto apresentou problema ao tentar reconverter.
Por isso este pacote foi preparado usando um video recuperado do historico do projeto e convertido para um MP4 mais compativel: videos/tv-tvcompativel.mp4

COMO TESTAR
- abra localmente ou publique os arquivos
- se trocar o video depois, atualize o campo "version" no config.json
- para substituir por outro video, prefira MP4 H.264 + AAC
