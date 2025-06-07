/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react'
import {
    Dialog,
 
    DialogContent,
    DialogHeader,
    DialogTitle,
 
  } from "@/components/ui/dialog";
   import {
     
      PlayCircle,
    } from "lucide-react";

function WatchNowDialog({  dialogOpen, setDialogOpen, selectedMovie }:{
    dialogOpen: boolean;
    setDialogOpen: (open: boolean) => void;
    selectedMovie: {
        Poster?: string;
        Title?: string;
        Rated?: string;
        Released?: string;
        Genre?: string;
        Director?: string;
        Writer?: string;
        Actors?: string;
        Language?: string;
        Country?: string;
        Awards?: string;
        BoxOffice?: string;
        Metascore?: string;
        imdbRating?: string;
        imdbVotes?: string;
    } | null;
}) {
 
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="w-full sm:max-w-6xl h-[80%] bg-gray-900 text-white p-6 rounded-lg">
            <div className="flex flex-col md:flex-row gap-5 items-center mb-6">
              <img
                src={selectedMovie?.Poster}
                alt={selectedMovie?.Title}
                className="w-96 h-96 rounded-md shadow-lg"
              />
              <div className="space-y-1 text-sm">
                <p>
                  <strong>Rated:</strong> {selectedMovie?.Rated}
                </p>
                <p>
                  <strong>Released:</strong> {selectedMovie?.Released}
                </p>
                <p>
                  <strong>Genre:</strong> {selectedMovie?.Genre}
                </p>
                <p>
                  <strong>Director:</strong> {selectedMovie?.Director}
                </p>
                <p>
                  <strong>Writer:</strong> {selectedMovie?.Writer}
                </p>
                <p>
                  <strong>Actors:</strong> {selectedMovie?.Actors}
                </p>
                <p>
                  <strong>Language:</strong> {selectedMovie?.Language}
                </p>
                <p>
                  <strong>Country:</strong> {selectedMovie?.Country}
                </p>
                <p>
                  <strong>Awards:</strong> {selectedMovie?.Awards}
                </p>
                <p>
                  <strong>Box Office:</strong> {selectedMovie?.BoxOffice}
                </p>
                <p>
                  <strong>Metascore:</strong> {selectedMovie?.Metascore}
                </p>
                <p>
                  <strong>IMDb Rating:</strong> {selectedMovie?.imdbRating}
                </p>
                <p>
                  <strong>IMDb Votes:</strong> {selectedMovie?.imdbVotes}
                </p>
              </div>
            </div>
  
            <DialogHeader>
              <DialogTitle className="text-3xl">
                {selectedMovie?.Title}
              </DialogTitle>
            </DialogHeader>
  
            <div className="flex justify-center pb-4">
              <button className="flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-lg">
                <PlayCircle size={24} className="mr-3" />
                Play
              </button>
            </div>
          </DialogContent>
        </Dialog>
  )
}

export default WatchNowDialog
