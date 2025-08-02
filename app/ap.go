// Package ayutayasvr is the top of this module
package ayutayasvr

import (
	"log"
	"net/http"

	"github.com/swaggest/openapi-go/openapi3"
	"github.com/swaggest/rest/response/gzip"
	"github.com/swaggest/rest/web"
	swgui "github.com/swaggest/swgui/v5emb"
)

// ----------------------------------------------------------------------------

var handlerFuncs []func(*web.Service)

func addRegistrar(handlerFunc ...func(*web.Service)) {
	handlerFuncs = append(handlerFuncs, handlerFunc...)
}

// Ap is main
func Ap() {
	svc := web.NewService(openapi3.NewReflector())
	svc.Wrap(
		gzip.Middleware, // Response compression with support for direct gzip pass through.
	)
	for i := range handlerFuncs {
		handlerFuncs[i](svc)
	}
	svc.Docs("/docs", swgui.New)
	log.Println("http://localhost:8011/docs")
	if err := http.ListenAndServe("localhost:8011", svc); err != nil {
		log.Fatal(err)
	}
}
