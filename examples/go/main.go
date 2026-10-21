package main

import (
	"html/template"
	"log"
	"net/http"
)

func render(w http.ResponseWriter, page string) {
	t, err := template.ParseFiles("templates/layout.html", "templates/"+page+".html")
	if err != nil {
		http.Error(w, "template error", http.StatusInternalServerError)
		log.Println(err)
		return
	}
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	if err := t.ExecuteTemplate(w, "layout", nil); err != nil {
		http.Error(w, "template error", http.StatusInternalServerError)
		log.Println(err)
	}
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/" {
			http.NotFound(w, r)
			return
		}
		render(w, "home")
	})
	mux.HandleFunc("/about", func(w http.ResponseWriter, r *http.Request) {
		render(w, "about")
	})
	mux.HandleFunc("/product", func(w http.ResponseWriter, r *http.Request) {
		render(w, "product")
	})
	log.Println("http://localhost:8093")
	log.Fatal(http.ListenAndServe("localhost:8093", mux))
}
