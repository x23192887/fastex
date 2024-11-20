package com.nci.skeleton.service;

import com.nci.skeleton.model.MasterData;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MasterDataService {
    public static MasterData data;

    static {
        try {
            data = new MasterData();

            data.setLocations(List.of("Dublin","Cork","Limerick","Galway",
                    "Waterford","Drogheda","Kilkenny","Wexford","Sligo","Clonmel",
                    "Dundalk","Bray","Navan ","Ennis","Carlow","Naas","Athlone","Donegal","Mayo","Tipperary"));
            data.setBookingClass(List.of("STANDARD","EXPRESS","ONE-DAY","CHEAPER"));
        } catch (Exception ex) {
            System.out.println(ex.getLocalizedMessage());
        }
    }
    public MasterData fetchMasterData() {
        return data;
    }
}
